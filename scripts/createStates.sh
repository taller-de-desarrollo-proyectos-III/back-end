curl --request POST \
  --url http://localhost:5000/states \
  --header 'content-type: application/json' \
  --cookie _session_id=2777ff79d5e1e5d8bb389b2e45230a66 \
  --data '{
	"name": "Activx"
}'

curl --request POST \
  --url http://localhost:5000/states \
  --header 'content-type: application/json' \
  --cookie _session_id=2777ff79d5e1e5d8bb389b2e45230a66 \
  --data '{
	"name": "Inctivx"
}'

curl --request POST \
  --url http://localhost:5000/states \
  --header 'content-type: application/json' \
  --cookie _session_id=2777ff79d5e1e5d8bb389b2e45230a66 \
  --data '{
	"name": "Deshabilitadx"
}'
