FROM nginx:alpine

LABEL maintainer="Diet-Med Team"
LABEL description="Frontend container for Diet-Med Landing Page"

COPY src/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
