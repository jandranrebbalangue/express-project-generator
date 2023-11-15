#!/bin/bash

current_date=$(date '+%Y-%m-%d')
current_start_time="00:00 CST"
current_end_time="23:59 CST"

start_datetime="$current_date $current_start_time"
end_datetime="$current_date $current_end_time"
command="greenarrow bounce_recovery list --start \"$start_datetime\" --end \"$end_datetime\" > ../csv/$current_date.csv"
eval "$command"
