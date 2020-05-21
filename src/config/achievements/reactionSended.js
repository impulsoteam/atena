export const reactionSended = () => {
  const medals = [
    {
      name: 'bronze',
      displayMedal: 'Bronze',
      targets: [1, 2, 5, 8, 13],
      score: 5
    },
    {
      name: 'silver',
      displayMedal: 'Prata',
      targets: [25, 41, 61, 85, 113],
      score: 10
    },
    {
      name: 'gold',
      displayMedal: 'Ouro',
      targets: [162, 221, 288, 365, 450],
      score: 15
    },
    {
      name: 'platinum',
      displayMedal: 'Platina',
      targets: [578, 722, 882, 1058, 1250],
      score: 20
    },
    {
      name: 'diamond',
      displayMedal: 'Diamante',
      targets: [1513, 1800, 2113, 2450, 2813, null],
      score: 25
    }
  ]

  return {
    displayAchievement: 'Reações Enviadas',
    name: 'reactionSended',
    medals
  }
}
