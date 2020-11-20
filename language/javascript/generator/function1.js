

async function get() {
  let value = 0;
  await setTimeout(function() {
    value = 1;
  }, 3000);
  return value;
}

console.log(get());
