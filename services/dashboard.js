export default {
  parseData: function({ aggregations = {}, totalChannels, activeChannels }) {
    const me = this;

    return new Promise((resolve) => {
      resolve({
        total: me.parseTotalData(aggregations, totalChannels, activeChannels),
        charts: {
          opportunities: {
            histogram: me.parseHistogram(aggregations, 'requests', 'Opportunitites'),
            byChannel: me.parseDiagram(aggregations, 'requests', 'channel'),
            byCountry: me.parseDiagram(aggregations, 'requests', 'country'),
            byEnvType: me.parseDiagram(aggregations, 'requests', 'environment'),
            perDemand: me.parseDiagram(aggregations, 'requests', 'demand')
          },
          impressions: {
            histogram: me.parseHistogram(aggregations, 'impressions', 'Impressions'),
            byChannel: me.parseDiagram(aggregations, 'impressions', 'channel'),
            byCountry: me.parseDiagram(aggregations, 'impressions', 'country'),
            byEnvType: me.parseDiagram(aggregations, 'impressions', 'environment'),
            perDemand: me.parseDiagram(aggregations, 'impressions', 'demand')
          },
          completions: {
            histogram: me.parseHistogram(aggregations, 'completes', 'Completions'),
            byChannel: me.parseDiagram(aggregations, 'completes', 'channel'),
            byCountry: me.parseDiagram(aggregations, 'completes', 'country'),
            byEnvType: me.parseDiagram(aggregations, 'completes', 'environment'),
            perDemand: me.parseDiagram(aggregations, 'completes', 'demand')
          }
        }
      });
    });
  },

  parseTotalData: function(aggregations, totalChannels = 0, activeChannels = 0) {
    const data = {
      active: activeChannels,
      total: totalChannels,
      opportunities: 'requests' in aggregations ? ('count' in aggregations.requests ? aggregations.requests.count : 0) : 0,
      impressions: 'impressions' in aggregations ? ('count' in aggregations.impressions ? aggregations.impressions.count : 0) : 0,
      completions: 'completes' in aggregations ? ('count' in aggregations.completes ? aggregations.completes.count : 0) : 0,
      revenue:  'completes' in aggregations ? aggregations.completes.metrics.vsp_revenue.values.cpm.value : 0
    };

    data.fillRate = data.opportunities > 0 ? (data.completions / data.opportunities) : 0;

    return data;
  },

  parseDiagram: function(aggregations, target, type) {
    const data = aggregations[target] ? aggregations[target].metrics[type].values : null,
      values = [];

      for (let i in data) {
        values.push({key: data[i].label, y: data[i].value});
      }

      return values;
  },

  parseHistogram: function(aggregations, target, name) {
    const data = aggregations[target] ? aggregations[target].histogram : null,
      values = [];

    if (!data) {
      return [];
    }

    for (let key in data) {
      values.push(
        {
          x: data[key].timestamp,
          y: data[key].value
        }
      );
    }
    return [
      {
        key: name,
        values
      }
    ];
  }
};
