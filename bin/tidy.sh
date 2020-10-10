tslint \
  -c tslint-import.json \
  --project tsconfig.json \
  src/**/*.{ts,tsx} \
  --fix \
  &&\
prettier \
  --write src/**/*.{ts,tsx}
