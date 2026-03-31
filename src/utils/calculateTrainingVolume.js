export function calculateTrainingVolume(logs) {

  let totalVolume = 0;

  logs.forEach(log => {
    const volume = log.weight * log.reps;
    totalVolume += volume;
  });

  return totalVolume;
}