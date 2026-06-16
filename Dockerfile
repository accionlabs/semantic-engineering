FROM nginx:1.27-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY . /usr/share/nginx/html/

# Rewrite generated paths
RUN find /usr/share/nginx/html -type f -name "*.html" \
    -exec sed -i 's|/semantic-engineering/|/|g' {} \;

EXPOSE 80

CMD ["nginx","-g","daemon off;"]
