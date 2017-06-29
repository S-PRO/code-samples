<?php
namespace HulkPlayer\V1\Rest\Calendar;

class CalendarResourceFactory
{
    public function __invoke($services)
    {
        return new CalendarResource($services);
    }
}
