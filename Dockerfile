FROM registry-vpc.cn-beijing.aliyuncs.com/devopsflow/centos:7

MAINTAINER wolf zhu <zhuyuan@burgeon.cn>

RUN rpm -Uvh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm &&   yum install nginx -y
RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
  && echo 'Asia/Shanghai' >/etc/timezone
  
RUN mkdir -p /usr/share/nginx/admin
COPY ./dist/ /usr/share/nginx/html/
COPY ./dist/ /usr/share/nginx/html/manage/
COPY ./dist/ /usr/share/nginx/admin/

RUN mkdir -p /etc/conf.d
RUN touch /etc/conf.d/web.conf

EXPOSE 80
EXPOSE 443

ENV PATH /usr/sbin:$PATH

CMD ["nginx", "-g", "daemon off;"]