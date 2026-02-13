"""Connector registry and abstractions.

Community connectors live here. Enterprise connectors can be loaded dynamically via entry points
without modifying this package.
"""

from .base import Connector, ConnectorDefinition, ConnectorRegistry, registry

# Register built-in community connectors.
from . import example as _example  # noqa: F401
from . import postgres as _postgres  # noqa: F401
from . import mysql as _mysql  # noqa: F401
from . import s3 as _s3  # noqa: F401
from . import snowflake as _snowflake  # noqa: F401
from . import mongodb as _mongodb  # noqa: F401
from . import bigquery as _bigquery  # noqa: F401
from . import google_analytics as _google_analytics  # noqa: F401
from . import salesforce as _salesforce  # noqa: F401
from . import hubspot as _hubspot  # noqa: F401
from . import stripe as _stripe  # noqa: F401
from . import github as _github  # noqa: F401
from . import shopify as _shopify  # noqa: F401
from . import slack as _slack  # noqa: F401
from . import sqlserver as _sqlserver  # noqa: F401
from . import google_sheets as _google_sheets  # noqa: F401
from . import zendesk as _zendesk  # noqa: F401
from . import mailchimp as _mailchimp  # noqa: F401
from . import redshift as _redshift  # noqa: F401
from . import gcs as _gcs  # noqa: F401
from . import intercom as _intercom  # noqa: F401
from . import quickbooks as _quickbooks  # noqa: F401
from . import twilio as _twilio  # noqa: F401
from . import asana as _asana  # noqa: F401
from . import jira as _jira  # noqa: F401
from . import facebook_ads as _facebook_ads  # noqa: F401

__all__ = ["Connector", "ConnectorDefinition", "ConnectorRegistry", "registry"]
