FROM httpd:alpine

# Включаем mod_rewrite и mod_http2
RUN sed -i 's/#LoadModule rewrite_module/LoadModule rewrite_module/' /usr/local/apache2/conf/httpd.conf && \
    # Включаем mod_http2 для HTTP/2 поддержки
    sed -i 's/#LoadModule http2_module/LoadModule http2_module/' /usr/local/apache2/conf/httpd.conf && \
    # Включаем mod_headers для управления заголовками
    sed -i 's/#LoadModule headers_module/LoadModule headers_module/' /usr/local/apache2/conf/httpd.conf && \
    # Включаем mod_expires для управления кэшированием
    sed -i 's/#LoadModule expires_module/LoadModule expires_module/' /usr/local/apache2/conf/httpd.conf && \
    # Включаем mod_deflate для сжатия
    sed -i 's/#LoadModule deflate_module/LoadModule deflate_module/' /usr/local/apache2/conf/httpd.conf && \
    # Разрешаем .htaccess
    sed -i 's/AllowOverride None/AllowOverride All/' /usr/local/apache2/conf/httpd.conf && \
    # Добавляем поддержку HTTP/2 в конец конфига
    echo 'Protocols h2 http/1.1' >> /usr/local/apache2/conf/httpd.conf && \
    echo 'H2Push on' >> /usr/local/apache2/conf/httpd.conf

COPY dist/ /usr/local/apache2/htdocs/
COPY .htaccess /usr/local/apache2/htdocs/.htaccess
