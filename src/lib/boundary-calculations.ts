interface BoundaryDistances {
  limitedApproach: string;
  restrictedApproach: string;
}

export function calculateBoundaries(voltageRange: string): BoundaryDistances {
  // Based on NFPA 70E Table 130.4(E)(a) - Approach Boundaries to Energized Electrical Conductors or Circuit Parts for Shock Protection for Alternating-Current Systems
  switch (voltageRange) {
    case '50V – 240V':
      return {
        limitedApproach: '1.0 m (3 ft 6 in.)',
        restrictedApproach: '0.3 m (1 ft 0 in.)'
      };
    case '241V – 600V':
      return {
        limitedApproach: '1.0 m (3 ft 6 in.)',
        restrictedApproach: '0.3 m (1 ft 0 in.)'
      };
    case '601V – 750V':
      return {
        limitedApproach: '1.0 m (3 ft 6 in.)',
        restrictedApproach: '0.3 m (1 ft 0 in.)'
      };
    case '751V – 1000V':
      return {
        limitedApproach: '1.0 m (3 ft 6 in.)',
        restrictedApproach: '0.3 m (1 ft 0 in.)'
      };
    case '1.1kV – 15kV':
      return {
        limitedApproach: '1.5 m (5 ft 0 in.)',
        restrictedApproach: '0.7 m (2 ft 2 in.)'
      };
    default:
      return {
        limitedApproach: 'Consult qualified personnel',
        restrictedApproach: 'Consult qualified personnel'
      };
  }
} 