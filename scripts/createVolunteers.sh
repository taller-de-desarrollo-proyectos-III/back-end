commissions=$(curl --request GET \
  --url http://localhost:5000/commissions \
  --header 'content-type: application/json' \
  --cookie _session_id=2777ff79d5e1e5d8bb389b2e45230a66)

commissionUuids=( $(echo "$commissions" | jq -r '.[].uuid' /dev/stdin) )

names=("Juan" "Pedro" "Pablo" "Jorge" "Juana" "Marta" "Celia" "Sofía" "Romina" "Candela" "Horacio" "Tadeo" "Camilo")
surnames=("García" "Martinez" "Pérez" "Rodriguez" "Gutiérrez" "Solari")

for commissionUuid in "${commissionUuids[@]}"
do

  name=${names[$RANDOM % ${#names[@]} ]}
  surname=${surnames[$RANDOM % ${#surnames[@]} ]}
  dni=$((10000000 + RANDOM))

  curl --request POST \
    --url http://localhost:5000/volunteers \
    --header 'content-type: application/json' \
    --cookie _session_id=2777ff79d5e1e5d8bb389b2e45230a66 \
    --data '{
      "commissionUuids": [
        "'"$commissionUuid"'"
      ],
      "name": "'"$name"'",
      "surname": "'"$surname"'",
      "dni": "'"$dni"'"
  }'

done
