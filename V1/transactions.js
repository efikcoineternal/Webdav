curl https://api.thirdweb.com/v1/transactions \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'x-secret-key: pOD...EWXw' \
  --data '{
  "chainId": 421614,
  "transactions": [
    {
      "data": "0x",
      "to": "vitalik.eth",
      "value": "0"
    }
  ]
}'
