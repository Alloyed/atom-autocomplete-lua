'use babel'

import includes from 'lodash.includes'

let providers = []

export function addOptionProviders (v) {
  v.forEach(provider => {
    providers.push({
      provider
    })
  })
}

export function removeOptionProviders (v) {
  providers = providers.filter(p => !includes(v, p.provider))
  v.forEach(provider => provider.dispose && provider.dispose())
}

export default function getOptions (request) {
  providers.sort((a, b) => b.provider.priority - a.provider.priority)
  const chainProviders = (index) => {
    const providerSpec = providers[index]
    if (!providerSpec) { return () => ({}) }
    return async function () {
      const nextGetOptions = chainProviders(index + 1)
      return (await providerSpec.provider.getOptions(request, nextGetOptions)).options
    }
  }
  return Promise.resolve(chainProviders(0)())
}