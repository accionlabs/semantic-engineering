FROM nginx:1.27-alpine

RUN rm -rf /usr/share/nginx/html/*

RUN mkdir -p /usr/share/nginx/html/semantic-engineering     

COPY . /usr/share/nginx/html/semantic-engineering/

EXPOSE 80

CMD ["nginx","-g","daemon off;"]
