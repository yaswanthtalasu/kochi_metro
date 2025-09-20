import { Train, BayAssignment } from '../types/train';

const DEPOT_LAYOUT = {
  bays: [
    { id: 1, x: 100, y: 100 },
    { id: 2, x: 200, y: 100 },
    { id: 3, x: 300, y: 100 },
    { id: 4, x: 400, y: 100 },
    { id: 5, x: 500, y: 100 },
    { id: 6, x: 100, y: 200 },
    { id: 7, x: 200, y: 200 },
    { id: 8, x: 300, y: 200 },
    { id: 9, x: 400, y: 200 },
    { id: 10, x: 500, y: 200 },
    { id: 11, x: 100, y: 300 },
    { id: 12, x: 200, y: 300 },
    { id: 13, x: 300, y: 300 },
    { id: 14, x: 400, y: 300 },
    { id: 15, x: 500, y: 300 }
  ],
  exit: { x: 600, y: 200 }
};

function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function allocateBays(trains: Train[]): BayAssignment[] {
  const sortedTrains = [...trains].sort((a, b) => b.bay_priority - a.bay_priority);
  const assignments: BayAssignment[] = [];
  
  sortedTrains.slice(0, 15).forEach((train, index) => {
    const bay = DEPOT_LAYOUT.bays[index];
    const distanceToExit = calculateDistance(bay.x, bay.y, DEPOT_LAYOUT.exit.x, DEPOT_LAYOUT.exit.y);
    
    assignments.push({
      train,
      bay_number: bay.id,
      distance_to_exit: Math.round(distanceToExit),
      path: [`Bay ${bay.id}`, 'Maintenance Track', 'Main Line', 'Exit Point']
    });
  });
  
  return assignments;
}

export function getDepotLayout() {
  return DEPOT_LAYOUT;
}