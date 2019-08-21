
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

pushd "$SCRIPTPATH"
npm install
pushd lib/Application
npm install
cd ../postprocessor
npm install
popd
source ./build.sh
popd
