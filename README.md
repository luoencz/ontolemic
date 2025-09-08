# Inner Cosmos

This is a space for exploration, wonder and attunement. Also known as a personal website of Theo Ryzhenkov. Dispersed throughout our pieces of myself — curious data points about my writing, thought and life among the charcoal vastness of realms yet unexplored. 


## Development

The web-server is configured to receive webhook events from GitHub releases. When you are ready to deploy a new version, run  ```tar -czvf frontend.tar.gz -C frontend/dist```, push, make a release. CI / CD pipeline will pick up tar file, and deploy it with nginx. 


