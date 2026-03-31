export function getPersonalRecords(logs) {
  const records = {};

  logs.forEach(log => {
    const ex = log.exercise;

    if (!records[ex] || log.weight > records[ex]) {
      records[ex] = log.weight;
    }
  });
  
  return records;
}