terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

module "network" {
  source = "../../modules/network"

  name   = "openfuse-dev"
  region = var.region
}

variable "region" {
  description = "AWS region for dev environment"
  type        = string
  default     = "us-east-1"
}
