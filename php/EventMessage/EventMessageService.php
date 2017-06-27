<?php

namespace Jarvis\V1\Rest\EventMessage;

use Thor\V1\Rest\ThorService;
use Doctrine\ORM\Tools\Pagination\Paginator;
use HulkPlayer\V1\Rest\Profile\Entity\Player;
use HulkPlayer\V1\Rest\MuteEvent\MuteEventEntity;
class EventMessageService extends ThorService
{
    /**
     * Create EventMessageEntity
     *
     * @param int $event_id
     * @param string $message_text
     * @param int|null $parent_id
     *
     * @return bool|int
     */
    public function create($event_id, $message_text, $parent_id = NULL){
        /*
         * Get event message author (current user)
         */
        $player = $this->getPlayerService()->get($this->getUserId());
        if(!$player){
            $this->getLogger()->report(3, NULL, __CLASS__, __METHOD__, NULL, "Error while event message creation - can't find user #[{$this->getUserId()}]");
            return FALSE;
        }

        $event = $this->getEventService()->get($event_id);
        if(!$event){
            $this->getLogger()->report(3, NULL, __CLASS__, __METHOD__, NULL, "Error while event message creating - can't find event #[{$event_id}]");
            return FALSE;
        }

        $event_players = $this->getEventPlayerService()->get(array("event" => $event_id, "player" => $player->getuser_id()));
        if(($event->getType() == "private") && !$event_players){
            $this->getLogger()->report(3, NULL, __CLASS__, __METHOD__, NULL, "Error while event message creation - user #[{$this->getUserId()}] is not a member of private event #[{$event_id}]");
            return FALSE;
        }

        $parent_post = NULL;
        if($parent_id) {
            $parent_post = $this->get($parent_id);
            if (!$parent_post) {
                $this->getLogger()->report(3, NULL, __CLASS__, __METHOD__, NULL, "Error while event message creating - can't find parent post #[{$parent_id}]");
                return FALSE;
            }
        }

        /*
         * If user has Global Mute ON and it's first message from this player we need to add current Event wall to Muted (if it wasn't!)
         */
        if ($player->getGlobalMuteStatus()==1){

            $message_counter = 0;
            foreach($this->getEventMessageService()->get(array("event" => $event->getId())) as $eventM){
                if ($eventM->getPlayer()->getuser_id() == $player->getuser_id()){
                    $message_counter++;
                }
            }
            $is_muted = $this->getEntityManager()->find('Jarvis\V1\Rest\Event\EventEntity', $event_id)->checkIfMutedByID($player->getuser_id());
            $this->getLogger()->report(1, NULL, __CLASS__, __METHOD__, NULL, "Player ID #[{$player->getuser_id()}] has [".$message_counter."] messages on this wall");

            //We'll set Mute on this wall only if it's first message and if it wasn't muted before
            if (($message_counter==0) && !$is_muted){
                $mute = new MuteEventEntity($event, $player);
                $this->getEntityManager()->persist($mute);
                $this->getEntityManager()->flush();
                $this->getLogger()->report(1, NULL, __CLASS__, __METHOD__, NULL, "Player ID #[{$player->getuser_id()}] has Global Mute ON, so after posting 1st message on Event wall [{$event->getId()}] it's now muted");
            }
        }

        /*
         * Create event message
         */
        $event_message = new EventMessageEntity($event, $player, $message_text);

        if($parent_post) $event_message->setParent($parent_post);

        $this->getEntityManager()->persist($event_message);
        $this->getEntityManager()->flush();

        /*
         * Send event message email notification
         */
        $queue_element = (object) array(
            "type" => "event_message",
            "data" => (object) array(
                "event_message_id" => $event_message->getId()
            )
        );
        $this->getRabbitMQueue()->quickPublish($queue_element);

        $this->getLogger()->report(1, NULL, __CLASS__, __METHOD__, NULL, "Event message #[{$event_message->getId()}] was successfully created");

        /*
         * If it's a comment (not a message) we should notify only parent message creator
         */

        if ($parent_message = $event_message->getParent()){

            /*
            * Check if player is not author of parent message
            * check if player didn't mute event message notifications
            */
            $parent_author = $parent_message->getPlayer();
            if(($parent_author instanceof Player) && ($parent_author->getuser_id() != $event_message->getPlayer()->getuser_id()) && !($event->checkIfMutedByID($parent_author->getuser_id()))){
                $players_arr[] = array('player_id' => $parent_author->getuser_id());
                $this->getNotificationService()->createMultipleNotifications('event_message', $players_arr, $event_message);
            }
        }else{

            /*
             * Form Players list
             */
            $players = array();

            /*
            * All event members
            */
            foreach($event->getEventPlayers() as $eventPlayer){
                $players[] = $eventPlayer->getPlayer();
            }

            /*
             * All who write on event wall
             */
            foreach($this->getEventMessageService()->get(array("event" => $event->getId())) as $eventM){
                $players[] = $eventM->getPlayer();
            }

            /*
             * If it's a message from event creator then we also send notifications to invited users
             */
            if ($event_message->getPlayer() == $event_message->getEvent()->getCreator()){
                foreach($event->getEventInvites() as $eventInvite){
                    $players[] =  $eventInvite->getPlayer();
                }
            }

            $players = array_unique($players);

            /*
             * Creating array for notification service
             */
            $players_arr = array();
            foreach($players as $player){
                //Additional check for Author and Muted
                if(($player instanceof Player) && ($player->getuser_id() != $event_message->getPlayer()->getuser_id()) && !($event->checkIfMutedByID($player->getuser_id()))) {
                    $players_arr[] = array('player_id' => $player->getuser_id());
                }
            }

            $this->getNotificationService()->createMultipleNotifications('event_message', $players_arr, $event_message);
        }

        return $event_message->getId();
    }

    /**
     * Update EventMessageEntity
     *
     * @param int $message_id
     * @param string|null $message_text
     * @param bool|null $deleted_status
     *
     * @return bool|int
     */
    public function update($message_id, $message_text = NULL, $deleted_status = NULL){
        $message = $this->get($message_id);
        if(!$message){
            $this->getLogger()->report(3, NULL, __CLASS__, __METHOD__, NULL, "Error while event message #[{$message_id}] updating - can't find message #[{$message_id}]");
            return FALSE;
        }

        if($message->getPlayer()->getuser_id() != $this->getUserId()){
            $this->getLogger()->report(3, NULL, __CLASS__, __METHOD__, NULL, "Error while event message #[{$message_id}] updating - user #[{$this->getUserId()}] can update only his own messages");
            return FALSE;
        }

        if($message_text)   $message->setMessageText($message_text);
        if($deleted_status) $message->setDeletedStatus($deleted_status);

        $this->getEntityManager()->persist($message);
        $this->getEntityManager()->flush();

        $this->getLogger()->report(1, NULL, __CLASS__, __METHOD__, NULL, "Event message #[{$message->getId()}] was successfully updated");

        return $message->getId();
    }

    /**
     * Delete EventMessageEntity
     *
     * @param int $message_id
     *
     * @return bool|int
     */
    public function delete($message_id){
        $message = $this->get($message_id);
        if(!$message){
            $this->getLogger()->report(3, NULL, __CLASS__, __METHOD__, NULL, "Error while event message #[{$message_id}] deleting - can't find message #[{$message_id}]");
            return FALSE;
        }

        if($message->getPlayer()->getuser_id() != $this->getUserId()){
            $this->getLogger()->report(3, NULL, __CLASS__, __METHOD__, NULL, "Error while event message #[{$message_id}] deleting - user #[{$this->getUserId()}] can update only his own messages");
            return FALSE;
        }

        /*
         * If message has responses we can't delete it instead we set deleted flag
         */
        if($message->getParent()){
            return $this->update($message_id, null, 1);
        }

        $event_id = $message->getEvent()->getId();

        $this->getEntityManager()->remove($message);
        $this->getEntityManager()->flush();

        $this->getLogger()->report(1, NULL, __CLASS__, __METHOD__, NULL, "Event message #[{$message->getId()}] for event #[{$event_id}] was successfully deleted");

        return $message_id;
    }

    /**
     * Get EventMessageEntity
     *
     * @param int|array|null $where
     * @return EventMessageEntity|EventMessageEntity[]|bool
     */
    public function get($where = NULL){
        if(is_numeric($where)){
            return $this->getEntityManager()->find('Jarvis\V1\Rest\EventMessage\EventMessageEntity', $where);
        }elseif(is_array($where)){
            return $this->getEntityManager()
                ->getRepository('Jarvis\V1\Rest\EventMessage\EventMessageEntity')
                ->findBy($where);
        }elseif(is_null($where)){
            return $this->getEntityManager()
                ->getRepository('Jarvis\V1\Rest\EventMessage\EventMessageEntity')
                ->findAll();
        }
        return FALSE;
    }

    /**
     * Get Array Copy of EventMessageEntity Collection
     *
     * @param null|EventMessageEntity|EventMessageEntity[] $where
     * @return array|bool
     */
    public function getArrayCopy($where = NULL){
        $event_messages = $this->get($where);
        if(is_array($event_messages)) {
            foreach ($event_messages as $key => $message) {
                if($message instanceof EventMessageEntity)
                    $event_messages[$key] = $message->toArray();
            }
        }elseif($event_messages instanceof EventMessageEntity){
            $event_messages->getArrayCopy();
        }
        return $event_messages;
    }
}