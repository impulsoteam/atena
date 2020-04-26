# Wordpress Integration

Atena has integration with Wordpress, where users earn reputation by posting blog posts.

## Creating a test environment

To create a test environment for this feature, you must:

- [Install a Wordpress Application](#wordpress-install)
- [Install the WP Webhooks plugin](#plugin)
- In `Settings` > `WP Webhooks` > `Settings`, enable `Send Data On New Post`, `Send Data On Post Update` and save.
- Then go to `Settings` > `WP Webhooks` > `Send Data`, add `Send Data On New Post` and `Send Data On Post Update` to url `http://{your-atena-url}/blog`

### Instalação do Wordpress

- Have a wordpress installation, any theme can be used.

### Plugin Installation

To install the plugin [WP Webhooks](https://wordpress.org/plugins/wp-webhooks/), just go to the admin panel;

After that, just create a post and post it to score.

> If you have questions about installing Wordpress locally, you can follow this [tutorial](https://codex.wordpress.org/).
