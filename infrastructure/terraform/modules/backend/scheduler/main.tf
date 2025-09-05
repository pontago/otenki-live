locals {
  suffix = var.env == "prod" ? "" : "-${var.env}"
}

# Update weather forecast
resource "aws_scheduler_schedule" "update_weather_forecast" {
  name = "update-weather-forecast${local.suffix}"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression          = var.update_weather_forecast_schedule
  schedule_expression_timezone = "Asia/Tokyo"

  target {
    arn      = var.lambda_live_weather_forecast_arn
    role_arn = aws_iam_role.lambda_scheduler.arn
  }
}

# Queue live streams
resource "aws_scheduler_schedule" "queue_live_streams" {
  name = "queue-live-streams${local.suffix}"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression          = var.queue_live_streams_schedule
  schedule_expression_timezone = "Asia/Tokyo"

  target {
    arn      = var.lambda_queue_live_streams_arn
    role_arn = aws_iam_role.lambda_scheduler.arn
  }
}


resource "aws_iam_role" "lambda_scheduler" {
  name = "lambda-scheduler-role${local.suffix}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Principal = { Service = "scheduler.amazonaws.com" },
      Effect    = "Allow"
    }]
  })
}

resource "aws_iam_role_policy" "lambda_scheduler_policy" {
  role = aws_iam_role.lambda_scheduler.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect   = "Allow",
      Action   = "lambda:InvokeFunction",
      Resource = "*"
    }]
  })
}