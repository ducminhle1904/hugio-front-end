#!/bin/bash

echo '>>>>>>>>>>>>>> Build source'
npm run build

echo '>>>>>>>>>>>>>> Build shell image'
docker build . -t hugio/fe:app_shell -f ./deploy/shell/Dockerfile

echo '>>>>>>>>>>>>>> Build analysis image'
docker build . -t hugio/fe:app_analysis -f ./deploy/analysis/Dockerfile

echo '>>>>>>>>>>>>>> Build auth image'
docker build . -t hugio/fe:app_auth -f ./deploy/auth/Dockerfile

echo '>>>>>>>>>>>>>> Build cashbook image'
docker build . -t hugio/fe:app_cashbook -f ./deploy/cashbook/Dockerfile

echo '>>>>>>>>>>>>>> Build product image'
docker build . -t hugio/fe:app_product -f ./deploy/product/Dockerfile

echo '>>>>>>>>>>>>>> Build summary image'
docker build . -t hugio/fe:app_summary -f ./deploy/summary/Dockerfile

echo '>>>>>>>>>>>>>> Build user image'
docker build . -t hugio/fe:app_user -f ./deploy/user/Dockerfile

echo '>>>>>>>>>>>>>> Push shell image'
kind load docker-image hugio/fe:app_shell

echo '>>>>>>>>>>>>>> Push analysis image'
kind load docker-image hugio/fe:app_analysis

echo '>>>>>>>>>>>>>> Push auth image'
kind load docker-image hugio/fe:app_auth

echo '>>>>>>>>>>>>>> Push cashbook image'
kind load docker-image hugio/fe:app_cashbook

echo '>>>>>>>>>>>>>> Push product image'
kind load docker-image hugio/fe:app_product

echo '>>>>>>>>>>>>>> Push summary image'
kind load docker-image hugio/fe:app_summary

echo '>>>>>>>>>>>>>> Push user image'
kind load docker-image hugio/fe:app_user

echo '>>>>>>>>>>>>>> Deploy shell image'
kubectl apply -f ./deploy/shell/k8s -n frontend

echo '>>>>>>>>>>>>>> Deploy analysis image'
kubectl apply -f ./deploy/analysis/k8s -n frontend

echo '>>>>>>>>>>>>>> Deploy auth image'
kubectl apply -f ./deploy/auth/k8s -n frontend

echo '>>>>>>>>>>>>>> Deploy cashbook image'
kubectl apply -f ./deploy/cashbook/k8s -n frontend

echo '>>>>>>>>>>>>>> Deploy product image'
kubectl apply -f ./deploy/product/k8s -n frontend

echo '>>>>>>>>>>>>>> Deploy summary image'
kubectl apply -f ./deploy/summary/k8s -n frontend

echo '>>>>>>>>>>>>>> Deploy user image'
kubectl apply -f ./deploy/user/k8s -n frontend

echo '>>>>>>>>>>>>>> Clean kind image'
sleep 5s
docker exec -it kind-control-plane crictl rmi hugio/fe:app_shell
docker exec -it kind-control-plane crictl rmi hugio/fe:app_analysis
docker exec -it kind-control-plane crictl rmi hugio/fe:app_auth
docker exec -it kind-control-plane crictl rmi hugio/fe:app_cashbook
docker exec -it kind-control-plane crictl rmi hugio/fe:app_product
docker exec -it kind-control-plane crictl rmi hugio/fe:app_summary
docker exec -it kind-control-plane crictl rmi hugio/fe:app_user

echo '>>>>>>>>>>>>>> Clean image'
docker images | grep hugio | awk '{print $3}' | xargs docker rmi -f
