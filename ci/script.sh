# Run the python tests
src/manage.py test shareabouts_client
STATUS=$?
if [ $STATUS -ne 0 ]
then exit $STATUS
fi

# Change to the jasmine directory and run the JS tests
cd src/shareabouts_client/jasmine/
bundle exec rake jasmine:ci
STATUS=$?
if [ $STATUS -ne 0 ]
then exit $STATUS
fi
cd ../../..