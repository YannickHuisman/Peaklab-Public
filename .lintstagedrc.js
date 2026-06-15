export default {
  '*.{js,jsx,ts,tsx}': ['eslint --fix --max-warnings=-1 --no-warn-ignored'],
  '*.{js,jsx,ts,tsx,json,css,md}': ['prettier --write'],
};
