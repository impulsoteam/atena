## Integração com Wordpress
O Atena possui integração com o Wordpress, onde o usuário ganha pontos ao publicar posts no blog.

## Criando um ambiente para testes
Para criar um ambiente de testes para essa feature, é necessário:
- [Instalar uma aplicação Wordpress](#instalacao-do-wordpress)
- [Instalar o plugin WP Webhooks].
- Em `Configurações` > `WP Webhooks` > `Settings`, habilite `Send Data On New Post`, `	Send Data On Post Update` e salve.
- Depois vá em `Configurações` > `WP Webhooks` > `Send Data`, adicione em `Send Data On New Post` e em `Send Data On Post Update` a url `http://{sua-url-da-atena}/blog`

### Instalação do Wordpress
- Ter uma instalação wordpress (podendo ser utilizado qualquer tema). *

### Instalação do plugin 
Para instalar o plugin [WP Webhooks](https://wordpress.org/plugins/wp-webhooks/), basta acessar o painel administrativo da  em `



BLOG_API_URL

Após isso, basta criar um post e publicá-lo para pontuar.

> \* Caso tenha dúvidas sobre como instalar o Wordpress localmente, você pode seguir este [tutorial](https://codex.wordpress.org/pt-br:Instalando_o_WordPress).


