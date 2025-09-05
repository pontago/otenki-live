variable "env" {
    type = string
}

variable "lambda_live_weather_forecast_arn" {
    type = string
}

variable "lambda_queue_live_streams_arn" {
    type = string
}

variable "update_weather_forecast_schedule" {
    type = string
}

variable "queue_live_streams_schedule" {
    type = string
}