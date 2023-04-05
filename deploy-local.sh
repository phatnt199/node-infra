yarn rebuild
echo "Rebuilt sources"

rm -rf ~/Workspace/save/quantech/qt_sas/node_modules/@lb/infra/dist
echo "Clean up old sources"

mv dist ~/Workspace/save/quantech/qt_sas/node_modules/@lb/infra
echo "Deployed sources"
