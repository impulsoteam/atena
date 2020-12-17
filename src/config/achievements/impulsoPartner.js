export const partners = {
  'perfil-dio': 'Digital Innovation One',
  digitalinnovationone: 'Digital Innovation One',
  rocketseat: 'Rocketseat',
  rockeseatpro: 'Rocketseat',
  alura: 'Alura',
  imasters: 'Imasters',
  locawebpro: 'Locaweb Pro',
  navers: 'Nave',
  trt5regiao: 'TRT 5ª Região',
  'impulso-expert': 'Impulso Expert'
}

export const impulsoPartner = name => {
  const medals = [
    {
      name: 'diamond',
      displayMedal: 'Diamante',
      targets: [null],
      score: 25
    }
  ]

  const [, partner] = Object.entries(partners).find(([key]) => key === name)

  return {
    displayAchievement: `Parceiro ${partner}`,
    medals,
    name
  }
}
