<?php
namespace HulkPlayer\V1\Rest\Calendar;

use Thor\V1\Rest\ThorResource;
use ZF\ApiProblem\ApiProblem;

class CalendarResource extends ThorResource
{
    /**
     * Create a resource
     *
     * @param  mixed $data
     * @return ApiProblem|mixed
     */
    public function create($data)
    {
        $player_id = $this->getEvent()->getRouteMatch()->getParam('player_id');
        $user_id = $this->getUserId();
        if ($player_id != $user_id){
            return new ApiProblem(403, "Error while creating calendar - player can't do it for another player");
        }
        $player = $this->getPlayerService()->get($player_id);
        if (!$player || !$data->calendar_type || $player_id != $this->getUserId()){
            return new ApiProblem(400, "Error while creating calendar - no player with id=[{$player_id}] found or no calendar type provided or player has no rights");
        }
        if (!$data->calendar_type == 'all' || !$data->calendar_type == 'mine'){
            return new ApiProblem(400, "Error while creating calendar - wrong calendar type");
        }
        if ($calendar_link = $this->getCalendarService()->create($player_id, $data->calendar_type)){
            return new ApiProblem(200, "Calendar for player {$player_id} was successfully created", "success", "success", array ("calendar_link" => $calendar_link));
        } else {
            return new ApiProblem(405, "Calendar for player {$player_id} was not created");
        }
    }

    /**
     * Delete a resource
     *
     * @param  mixed $id
     * @return ApiProblem|mixed
     */
    public function delete($id)
    {
        return new ApiProblem(405, 'The DELETE method has not been defined for individual resources');
    }

    /**
     * Delete a collection, or members of a collection
     *
     * @param  mixed $data
     * @return ApiProblem|mixed
     */
    public function deleteList($data)
    {
        $player_id = $this->getEvent()->getRouteMatch()->getParam('player_id');
        $user_id = $this->getUserId();
        if ($player_id != $user_id){
            return new ApiProblem(403, "Error while deleting calendar - player can't do it for another player");
        }
        $player = $this->getPlayerService()->get($player_id);
        if (!$player || $player_id != $this->getUserId()){
            return new ApiProblem(400, "Error while deleting calendar - no player with id=[{$player_id}] found or player has no rights");
        }
        if ($this->getCalendarService()->delete($player_id)){
            return new ApiProblem(200, "Calendar for player id=[{$player_id}] was successfully deleted");
        }
        return new ApiProblem(404, 'Not found');
    }

    /**
     * Fetch a resource
     *
     * @param  mixed $id
     * @return ApiProblem|mixed
     */
    public function fetch($id)
    {
        return new ApiProblem(405, 'The GET method has not been defined for individual resources');
    }

    /**
     * Fetch all or a subset of resources
     *
     * @param  array $params
     * @return ApiProblem|mixed
     */
    public function fetchAll($params = array())
    {
        return new ApiProblem(405, 'The GET method has not been defined for individual resources');
    }

    /**
     * Patch (partial in-place update) a resource
     *
     * @param  mixed $id
     * @param  mixed $data
     * @return ApiProblem|mixed
     */
    public function patch($id, $data)
    {
        return new ApiProblem(405, 'The PATCH method has not been defined for individual resources');
    }

    /**
     * Replace a collection or members of a collection
     *
     * @param  mixed $data
     * @return ApiProblem|mixed
     */
    public function replaceList($data)
    {
        return new ApiProblem(405, 'The PUT method has not been defined for collections');
    }

    /**
     * Update a resource
     *
     * @param  mixed $id
     * @param  mixed $data
     * @return ApiProblem|mixed
     */
    public function update($id, $data)
    {
        return new ApiProblem(405, 'The PUT method has not been defined for individual resources');
    }
}
