#!/bin/bash
# Add SSL certificate for secondary domain the-o.space
certbot --nginx -d the-o.space -d home.the-o.space --non-interactive --agree-tos --register-unsafely-without-email 