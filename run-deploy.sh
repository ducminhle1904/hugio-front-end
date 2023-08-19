#!/bin/bash

dockerTag=$(date -d "$b 0 min" "+%Y%m%d%H%M%S")
appShellDockerImage='hugio/app_shell'
appAnalysisDockerImage='hugio/app_analysis'
appAuthDockerImage='hugio/app_auth'
appCashbookDockerImage='hugio/app_cashbook'
appProductDockerImage='hugio/app_product'
appSummaryDockerImage='hugio/app_summary'
appUserDockerImage='hugio/app_user'
appOrderDockerImage='hugio/app_order'
k8sNamespace='frontend'
k8sReplica=1

echo '>>>>>>>>>>>>>> Build source'
npm run build

echo '>>>>>>>>>>>>>> Build shell image'
docker build . -t $appShellDockerImage:$dockerTag -f ./deploy/shell/Dockerfile

echo '>>>>>>>>>>>>>> Build analysis image'
docker build . -t $appAnalysisDockerImage:$dockerTag -f ./deploy/analysis/Dockerfile

echo '>>>>>>>>>>>>>> Build auth image'
docker build . -t $appAuthDockerImage:$dockerTag -f ./deploy/auth/Dockerfile

echo '>>>>>>>>>>>>>> Build cashbook image'
docker build . -t $appCashbookDockerImage:$dockerTag -f ./deploy/cashbook/Dockerfile

echo '>>>>>>>>>>>>>> Build product image'
docker build . -t $appProductDockerImage:$dockerTag -f ./deploy/product/Dockerfile

echo '>>>>>>>>>>>>>> Build summary image'
docker build . -t $appSummaryDockerImage:$dockerTag -f ./deploy/summary/Dockerfile

echo '>>>>>>>>>>>>>> Build user image'
docker build . -t $appUserDockerImage:$dockerTag -f ./deploy/user/Dockerfile

echo '>>>>>>>>>>>>>> Build order image'
docker build . -t $appOrderDockerImage:$dockerTag -f ./deploy/order/Dockerfile

echo '>>>>>>>>>>>>>> Push shell image'
kind load docker-image $appShellDockerImage:$dockerTag

echo '>>>>>>>>>>>>>> Push analysis image'
kind load docker-image $appAnalysisDockerImage:$dockerTag

echo '>>>>>>>>>>>>>> Push auth image'
kind load docker-image $appAuthDockerImage:$dockerTag

echo '>>>>>>>>>>>>>> Push cashbook image'
kind load docker-image $appCashbookDockerImage:$dockerTag

echo '>>>>>>>>>>>>>> Push product image'
kind load docker-image $appProductDockerImage:$dockerTag

echo '>>>>>>>>>>>>>> Push summary image'
kind load docker-image $appSummaryDockerImage:$dockerTag

echo '>>>>>>>>>>>>>> Push user image'
kind load docker-image $appUserDockerImage:$dockerTag

echo '>>>>>>>>>>>>>> Push order image'
kind load docker-image $appOrderDockerImage:$dockerTag

echo '>>>>>>>>>>>>>> Deploy shell image'
helm upgrade -i --set image.name=$appShellDockerImage,image.tag=$dockerTag,replica=$k8sReplica -n $k8sNamespace app-shell ./deploy/shell/helm_chart

echo '>>>>>>>>>>>>>> Deploy analysis image'
helm upgrade -i --set image.name=$appAnalysisDockerImage,image.tag=$dockerTag,replica=$k8sReplica -n $k8sNamespace app-analysis ./deploy/analysis/helm_chart

echo '>>>>>>>>>>>>>> Deploy auth image'
helm upgrade -i --set image.name=$appAuthDockerImage,image.tag=$dockerTag,replica=$k8sReplica -n $k8sNamespace app-auth ./deploy/auth/helm_chart

echo '>>>>>>>>>>>>>> Deploy cashbook image'
helm upgrade -i --set image.name=$appCashbookDockerImage,image.tag=$dockerTag,replica=$k8sReplica -n $k8sNamespace app-cashbook ./deploy/cashbook/helm_chart

echo '>>>>>>>>>>>>>> Deploy product image'
helm upgrade -i --set image.name=$appProductDockerImage,image.tag=$dockerTag,replica=$k8sReplica -n $k8sNamespace app-product ./deploy/product/helm_chart

echo '>>>>>>>>>>>>>> Deploy summary image'
helm upgrade -i --set image.name=$appSummaryDockerImage,image.tag=$dockerTag,replica=$k8sReplica -n $k8sNamespace app-summary ./deploy/summary/helm_chart

echo '>>>>>>>>>>>>>> Deploy user image'
helm upgrade -i --set image.name=$appUserDockerImage,image.tag=$dockerTag,replica=$k8sReplica -n $k8sNamespace app-user ./deploy/user/helm_chart

echo '>>>>>>>>>>>>>> Deploy order image'
helm upgrade -i --set image.name=$appOrderDockerImage,image.tag=$dockerTag,replica=$k8sReplica -n $k8sNamespace app-order ./deploy/order/helm_chart

echo '>>>>>>>>>>>>>> Clean image'
docker rmi $appShellDockerImage:$dockerTag
docker rmi $appAnalysisDockerImage:$dockerTag
docker rmi $appAuthDockerImage:$dockerTag
docker rmi $appCashbookDockerImage:$dockerTag
docker rmi $appProductDockerImage:$dockerTag
docker rmi $appSummaryDockerImage:$dockerTag
docker rmi $appUserDockerImage:$dockerTag
docker rmi $appOrderDockerImage:$dockerTag
