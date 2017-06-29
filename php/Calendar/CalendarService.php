<?php

namespace HulkPlayer\V1\Rest\Calendar;

use Thor\V1\Rest\ThorService;
use DateTime;
use Jarvis\V1\Rest\Event\EventEntity;

class CalendarService extends ThorService
{
    /**
     * Calendar creation
     *
     * @param int $player_id
     * @param int $calendar_type
     *
     * @return string $calendar_link
     */
    public function create($player_id, $calendar_type){
        $calendar_link="";
        $events = [];
        $player = $this->getPlayerService()->get($player_id);

        /*
         * Check if directory exists and create if necessary
         */
        $full_dir_path = APPLICATION_PATH."/"."public/calendars/";

        if(!is_dir($full_dir_path)){
            $res = mkdir($full_dir_path, 0777, true);
            if(!$res) {
                $this->getLogger()->report(3, NULL, __CLASS__, __METHOD__, NULL, "Error while calendar creating - folder <{$full_dir_path}> doesn't exists and can't be created");
                return $calendar_link;
            }
        }

        //If player has already created calendar we should use present link. In other case we create new file
        if (!$calendar_link = $player->getCalendarLink()){
            $calendar_link = "public/calendars/calendar".$player_id."-".uniqid().".ics";
            $this->getLogger()->report(1, NULL, __CLASS__, __METHOD__, NULL, "New calendar for player [{$player_id}] was successfully created");
        }

        //form list of events depending on calendar_type
        if ($calendar_type == 'all') {
            $city = $player->getcity() ? $player->getcity() : NULL;
            $raw_events = $this->getEventService()->getEventsPagination(0, 200, $city, $player_id);
            foreach ($raw_events as $raw_event){
                $events[] = $raw_event[0];
            }
        } else if ($calendar_type == 'mine') {
            $current_date_utc = new DateTime(null, new \DateTimeZone("UTC"));
            $current_date_utc->modify("-12 hours");
            $raw_event_players = $this->getEventPlayerService()->get(array ("player" => $player_id));
            foreach ($raw_event_players as $raw_event_player){
                $event = $raw_event_player->getEvent();
                if ($event->getEventDate() > $current_date_utc){
                    $events[] = $event;
                }
            }
            $invites = $this->getEventInviteService()->get(array ("player" => $player_id, "expired" => NULL));
            foreach ($invites as $invite){
                $event = $invite->getEvent();
                if ($event->getEventDate() > $current_date_utc){
                    $events[] = $event;
                }
            }
        }

        $full_path = APPLICATION_PATH."/".$calendar_link;
        $server_path = $this->getConfig()['loki']['protocol']."://".$this->getConfig()['loki']['mainDomain'];

        $calendar_body = $this->getFilledBody($events, $player_id, $server_path, $calendar_type);
        $calendar_file = fopen($full_path, "w");
        fwrite($calendar_file, $calendar_body);
        fclose($calendar_file);

        $player->setCalendarType($calendar_type);
        $player->setCalendarLink($calendar_link);
        $this->getEntityManager()->persist($player);
        $this->getEntityManager()->flush();

        $this->getLogger()->report(1, NULL, __CLASS__, __METHOD__, NULL, "Calendar for player [{$player_id}] was successfully filled. Type=[{$calendar_type}].");

        return $calendar_link;
    }

    /**
     * Calendar update
     *
     * @param int $player_id
     *
     * @return bool
     */
    public function update($player_id){
        $player = $this->getPlayerService()->get($player_id);
        if ($calendar_type = $player->getCalendarType()){
            $this->create($player_id, $calendar_type);
        }
        return TRUE;
    }


    /**
     * Calendar deletion
     *
     * @param int $player_id
     *
     * @return bool
     */
    public function delete($player_id){
        $player = $this->getPlayerService()->get($player_id);

        if (!$calendar_link = $player->getCalendarLink()){
            return TRUE;
        }
        $full_path = APPLICATION_PATH."/".$calendar_link;
        if (unlink($full_path)){
            $player->setCalendarType(NULL);
            $player->setCalendarLink(NULL);
            $this->getEntityManager()->persist($player);
            $this->getEntityManager()->flush();
            $this->getLogger()->report(1, NULL, __CLASS__, __METHOD__, NULL, "Calendar for player [{$player_id}] was successfully deleted");

            return TRUE;
        } else {
            $this->getLogger()->report(3, NULL, __CLASS__, __METHOD__, NULL, "Calendar for player [{$player_id}] can't be deleted");

            return FALSE;
        }
    }

    public function getFilledBody($events, $player_id, $app_path, $calendar_type){
        $type = ($calendar_type =='all')? "All":"Mine";
        $player = $this->getPlayerService()->get($player_id);
        $firstname = $player->getfirstname();
        $lastname = $player->getlastname();

        //Form name - possible options according to BM-1004 are "FirstName-LastName-All-Events-On-Breakout" and "FirstName-LastName-Mine-Events-On-Breakout"
        $calendar_name = $firstname."-".$lastname."-".$type."-Events-On-Breakout";

        //Form calendar body
        $body = "BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\nPRODID:-//Breakoutplay//Events//EN"; //Calendar = e.g. “Breakout all events” or “Breakout my events”
        $body .= "\nNAME:".$calendar_name."\nX-WR-CALNAME:".$calendar_name;
        $body .= "\nDESCRIPTION:List of ".$type." events on Breakout\nX-WR-CALDESC:List of ".$type." events on Breakout";

        foreach ($events as $event) {
            if (($event instanceof EventEntity) && !$event->getCanceledStatus()){
                if ($status = $this->getEventPlayerService()->get(array('event' => $event->getId(), 'player' => $player_id))[0]->status){
                    if ($status == 'declined' && $calendar_type == 'mine'){
                        continue; // We skip adding events with status OUT to Mine Calendar - BM-1025
                    }
                    $status = $this->getNotificationService()->replaceStatusForFE($status);
                } else if ($invite = $this->getEventInviteService()->get(array('event' => $event->getId(), 'player' => $player_id, "expired" => NULL))[0]){
                    $status = "INVITED";
                } else if ($request = $this->getEventRequestService()->get(array('event' => $event->getId(), 'player' => $player_id, "checked" => 0, "approved" => 0))[0]) {
                    $status = "REQUESTED";
                } else {
                    $status = "NOT SET";
                }

                $body .= "\nBEGIN:VEVENT";
                $body .= "\nUID:" . $event->getId(); //Unique event identifier
                $body .= "\nDTSTART:".date('Ymd\THis\Z', $event->getEventDateUTC()->getTimestamp()); // Starts = event start time
                $body .= "\nDTEND:".date('Ymd\THis\Z', $event->getEventDateUTC()->getTimestamp()+3*60*60); //  Ends = start time + 3 hrs
                $body .= "\nDTSTAMP:".date('Ymd\THis\Z', $event->getEventDateUTC()->getTimestamp()); // Event timestamp
                $body .= "\nORGANIZER;CN=".$event->getCreator()->getfullname().":mailto:".$event->getCreator()->getemail(); // Creator name and email
                $body .= "\nURL;VALUE=URI:".$app_path."/app/event/{$event->getId()}"; // URL = direct link to event page at web app
                $body .= "\nDESCRIPTION:"."Player status: ".$status.'.\r\nEvent description: '.$this->cutEventDescription($event->getDescription()); // Notes = user status + event description
                $body .= "\nLOCATION:".str_replace(",", "",$event->getLocationAddress()); // Location field = event address
                $body .= "\nSUMMARY:".$event->getName(); // //Title field in native calendar = event title
                $body .= "\nSEQUENCE:0"; // Version of the event in calendar
                $body .= "\nTRANSP:TRANSPARENT"; // Can be also 'OPAQUE'
                $body .= "\nEND:VEVENT";
            }
        }

        $body .= "\nEND:VCALENDAR";

        return $body;
    }

    public function cutEventDescription($description){
        if (strlen($description)>50){
            $description=substr($description,0, 50);
            $last_space = strrpos ($description,' ');
            $description = substr($description, 0, $last_space)." ...";
        }

        return $description;
    }
}