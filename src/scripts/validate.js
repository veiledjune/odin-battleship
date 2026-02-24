export function validateShipPlacement(
  coordinates,
  shipLength,
  gameboard,
  maxShips,
  currentShips,
) {
  if (
    coordinates.length < 1 ||
    shipLength < 1 ||
    coordinates.length > 4 ||
    shipLength > 4
  )
    return false;

  if (shipLength !== coordinates.length) return false;

  for (let i = 0; i < coordinates.length; i++) {
    const coordinate = coordinates[i];
    if (coordinate < 0 || coordinate > 99) return false;
    if (gameboard[coordinate]) return false;
  }

  if (currentShips[`l${shipLength}`] >= maxShips[`l${shipLength}`])
    return false;

  if (coordinates.length > 1) {
    const sortedCoordinates = coordinates
      .map((coordinate) => coordinate)
      .sort((a, b) => a - b);

    const initialDifference = Math.abs(
      sortedCoordinates[0] - sortedCoordinates[1],
    );

    if (initialDifference !== 1 && initialDifference !== 10) return false;
    for (let i = 1; i < sortedCoordinates.length; i++) {
      const nextCoor = sortedCoordinates[i + 1];
      if (!nextCoor) break;
      const currentCoor = sortedCoordinates[i];
      const difference = Math.abs(currentCoor - nextCoor);
      if (difference !== initialDifference) return false;
    }

    const edgeIndices = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99];
    const isHorizontal = initialDifference === 1;
    if (isHorizontal) {
      for (let i = 0; i < sortedCoordinates.length; i++) {
        const coordinate = sortedCoordinates[i];
        if (
          edgeIndices.includes(coordinate) &&
          i !== sortedCoordinates.length - 1
        )
          return false;
      }
    }
  }

  return true;
}
