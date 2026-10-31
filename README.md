# Weather Reporter

## Autor
Leandro Kenji Assunção Kato — Matrícula 22551460

## Descrição
Um aplicativo de previsão do tempo. Usando a API do Open Meteo o usuário poderá acessar de qualquer lugar o clima atual de qualquer cidade do mundo.

## API utilizada
- Open Meteo e Geocoding 
- https://open-meteo.com/en/docs
- https://open-meteo.com/en/docs/geocoding-api
- Endpoints consumidos: 2

## Funcionalidades
- Digite o nome de uma cidade, o APP completa o nome e especifica país mesmo não escrito perfeitamente
- Uma aba de favoritos, o app tem a opção de salvar cidades com base no seu navegador atual, eles ficaram salvos mesmo após fechar o navegador em um banco de dados no Supabase.

## Docker 
- Aplicado usando o docker para utilização remota
- link do repositório docker: "https://hub.docker.com/repository/docker/leandrokak/bootcamp2-app/general"
- Comando para rodar: `docker run -d -p 8081:80 leandrokak/bootcamp2-app:1.0`

### Docker Tags
- O repositório docker atual possui 3 tags:
    1.0 - A versão inicial
    1.1 - Algumas alterações no style.css
    latest - Direta com a 1.1

### Otimização com .dockerignore
Utilizado o arquivo `.dockerignore` para excluir arquivos desnecessários durante a construção da imagem Docker. 
Benefícios:
- Builds mais rápidos: Reduz o tamanho do contexto enviado ao daemon do Docker durante o comando `docker build`.
- Imagens mais leves: Impede a cópia de arquivos temporários e dependências locais para a imagem final, garantindo um container mais enxuto e seguro.

## Como executar localmente
1. Clone: `git clone https://github.com/LeandroKAK/bootcamp2-app`
2. Abra o arquivo `index.html`

## Links
- **Aplicação no ar (GitHub Pages):** https://leandrokak.github.io/bootcamp2-app/
- **Repositório GitHub:** https://github.com/LeandroKAK/bootcamp2-app
- **Repositório Docker:** https://hub.docker.com/repository/docker/leandrokak/bootcamp2-app