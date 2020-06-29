import dash
import requests
import pandas as pd
import json
import dash_core_components as dcc
import dash_html_components as html
import dash_bootstrap_components as dbc
import plotly.graph_objects as go
from dash.dependencies import Input, Output, State

pd.set_option('mode.chained_assignment', None)

URL_data = 'https://brasil.io/api/dataset/covid19/caso_full/data/'
URL_GITHUB = 'https://github.com/leonardokume/brashboard'
LOGO = './assets/logo.png'
GITHUB_LOGO = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png'
POP_BR = 210147125
IBGE = pd.read_csv('./dados/cities_ibge_code.csv')


def get_dropdown_states():
    states = IBGE.loc[IBGE['type']=='state']
    states['value'] = states['value'].astype(str)
    states['value'] = states['value'].str.replace('.0', '', regex=False)
    dropdown = states.drop(labels=['type', 'state'], axis=1).to_dict('records')
    return(dropdown)

def get_dropdown_cities(state):
    state_abr = IBGE.loc[IBGE['value']==int(state)].state.item()
    cities = IBGE.loc[(IBGE['type']=='city') & (IBGE['state']==state_abr)]
    cities['value'] = cities['value'].astype(str)
    cities['value'] = cities['value'].str.replace('.0', '', regex=False)
    dropdown = cities.drop(labels=['type', 'state'], axis=1).to_dict('records')
    return(dropdown)

def get_ibge_label(ibge_code, type):
    if(type == 'city'):
        label = IBGE.loc[IBGE['value'] == int(ibge_code)].label.item()
        label = '{} ({})'.format(label, IBGE.loc[IBGE['value'] == int(ibge_code)].state.item())
    else:
        label = IBGE.loc[IBGE['value'] == int(ibge_code)].label.item()
    return(label)

def get_data(ibge_code):
    PARAMS = {'city_ibge_code':ibge_code}
    r = requests.get(url = URL_data, params = PARAMS)
    data = r.json()
    data = data['results']
    df = pd.read_json(json.dumps(data))
    return (df)

def get_br_data():
    PARAMS = {'place_type':'state', 'page_size':'10000'}
    r = requests.get(url = URL_data, params = PARAMS)
    data = r.json()
    data = data['results']
    df = pd.read_json(json.dumps(data))
    return (df)

def generate_scatter_fig(x, y, type):
    if(type == 'last_available_confirmed'):
        color = '#008cff'
        fcolor = 'rgba(0,140,255,0.3)'
    else:
        color = '#ff0000'
        fcolor = 'rgba(255,0,0,0.3)'

    fig = go.Figure(data=[go.Scatter(
                        x=x,
                        y=y,
                        mode='lines+markers',
                        line_color=color,
                        fill='tozeroy',
                        fillcolor=fcolor,
                        hovertemplate = '%{x}: %{y:.3s}<extra></extra>'
                        )]
                    )
    fig.update_layout(
        margin=dict(l=0, r=0, t=0, b=0),
        dragmode=False,
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        yaxis=dict(gridcolor='#d6d6d6'),
        xaxis_tickformat = '%d/%m'
    )
    return(fig)

def generate_bar_fig(x, y, type):
    if(type == 'new_confirmed'):
        color = '#008cff'
    else:
        color = '#ff0000'

    fig = go.Figure(data=[go.Bar(
                        x=x,
                        y=y,
                        marker_color=color,
                        hovertemplate = '%{x}: %{y:.3s}<extra></extra>'
                        )]
                    )
    fig.update_layout(
        margin=dict(l=0, r=0, t=0, b=0),
        dragmode=False,
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        yaxis=dict(gridcolor='#d6d6d6'),
        xaxis_tickformat = '%d/%m'
    )
    return(fig)

def generate_histogram_fig(x, y, type):
    if(type == 'new_confirmed'):
        color = '#008cff'
    else:
        color = '#ff0000'

    fig = go.Figure(data=[go.Histogram(
        histfunc="sum",
        x=x,
        y=y,
        marker_color=color,
        nbinsx=len(x.unique()),
        autobinx = False,
        hovertemplate = '%{x}: %{y:.3s}<extra></extra>'
        )]
    )
    fig.update_layout(
        margin=dict(l=0, r=0, t=0, b=0),
        dragmode=False,
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        yaxis=dict(gridcolor='#d6d6d6'),
        xaxis_range=(x.min()-0.5, x.max()+0.5),
        xaxis_dtick=1,
        bargap=0.2
    )
    return(fig)

def generate_indicator(data, change, date, type):
    if(type == 'deaths'):
        fig = [
            html.Center(
                [
                    html.H2(data),
                    html.H6('Óbitos totais'),
                    html.Center(html.H3(change)),
                    html.H6('Novos óbitos em {:%d/%m}'.format(date))
                ]
            )
        ]
    else:
        fig = [
            html.Center(
                [
                    html.H2(data),
                    html.H6('Casos totais'),
                    html.Center(html.H3(change)),
                    html.H6('Novos casos em {:%d/%m}'.format(date))
                ]
            )
        ]
    return(fig)

def generate_growth_indicator(data, change):
    diff = data - change
    if(diff > 0):
        fig = [
            html.Center(
                [
                    html.H2('{:,.2f}'.format(data).replace('.',',')),
                    html.H6('Novos casos a cada 100k habitantes')
                ]
            ),
            html.Center(
                [
                    html.H3('▲ ' + '{:,.2f}'.format(diff).replace('.',',')),
                    html.H6('Desde a semana anterior')
                ]
            )
        ]
    else:
        fig = [
                html.Center(
                [
                    html.H2('{:,.2f}'.format(data).replace('.',',')),
                    html.H6('Novos casos a cada 100k habitantes')
                ]
            ),
            html.Center(
                [
                    html.H3('▼ ' + '{:,.2f}'.format(diff).replace('.',',').replace('-','')),
                    html.H6('Desde a semana anterior')
                ]
            )
        ]
    return(fig)

def get_growth_data(df):
    group_ew = df.groupby(['epidemiological_week'])['new_confirmed'].sum()
    pop = df['estimated_population_2019'].iloc[0].item()
    current = (group_ew.iloc[-2].item() / pop) * 100000
    last = (group_ew.iloc[-3].item() / pop) * 100000
    return(current, last)

def generate_graphs(ibge_code):
    df = get_data(ibge_code)
    num = df._get_numeric_data()
    num[num < 0] = 0

    childrens = []

    cases = dcc.Graph(
        figure = generate_scatter_fig(x=df['date'], y=df['last_available_confirmed'], type='last_available_confirmed'),
        config = {'displayModeBar': False}
    )
    childrens.append(cases)

    deaths = dcc.Graph(
        figure = generate_scatter_fig(x=df['date'], y=df['last_available_deaths'], type='last_available_deaths'),
        config = {'displayModeBar': False}
    )
    childrens.append(deaths)

    cases_day = dcc.Graph(
        figure = generate_bar_fig(x=df['date'], y=df['new_confirmed'], type='new_confirmed'),
        config = {'displayModeBar': False}
    )
    childrens.append(cases_day)

    deaths_day = dcc.Graph(
        figure = generate_bar_fig(x=df['date'], y=df['new_deaths'], type='new_deaths'),
        config = {'displayModeBar': False}
    )
    childrens.append(deaths_day)

    cases_week = dcc.Graph(
        figure = generate_histogram_fig(x=df['epidemiological_week'], y=df['new_confirmed'], type='new_confirmed'),
        config = {'displayModeBar': False}
    )
    childrens.append(cases_week)

    deaths_week = dcc.Graph(
        figure = generate_histogram_fig(x=df['epidemiological_week'], y=df['new_deaths'], type='new_deaths'),
        config = {'displayModeBar': False}
    )
    childrens.append(deaths_week)

    ind_cases = generate_indicator(
        data='{:,d}'.format(df.loc[df['is_last']==True, 'last_available_confirmed'].item()).replace(',','.'),
        change='{:,d}'.format(df.loc[df['is_last']==True, 'new_confirmed'].item()).replace(',','.'),
        date=df.loc[df['is_last']==True, 'date'].item(),
        type='confirmed'
    )
    childrens.append(ind_cases)

    ind_deaths = generate_indicator(
        data='{:,d}'.format(df.loc[df['is_last']==True, 'last_available_deaths'].item()).replace(',', '.'),
        change='{:,d}'.format(df.loc[df['is_last']==True, 'new_deaths'].item()).replace(',','.'),
        date=df.loc[df['is_last']==True, 'date'].item(),
        type='deaths'
    )
    childrens.append(ind_deaths)

    data, change = get_growth_data(df)
    ind_growth = generate_growth_indicator(data, change)
    childrens.append(ind_growth)

    return(childrens)

    
NAVBAR = dbc.Navbar(
    [
        html.A(
            dbc.Row(
                [
                    dbc.Col(html.Img(src=LOGO, height="50px")),
                ],
                no_gutters=True,
            ),
        )
    ],
    color="#004c82",
    dark=True,
    sticky="top",
)

DROPDOWNS = [
    dbc.Col(
        [
            dcc.Dropdown(
                id="state",
                options=get_dropdown_states(),
                value=None, placeholder="Selecione o estado", 
            ),
        ],
        md=12, lg=3, style={"marginTop": 15}
    ),
    dbc.Col(
        [
            dcc.Dropdown(
                id="city",
                options=[],
                value=None, placeholder="Digite o nome da cidade", disabled=True,
            ),
        ],
        md=12, lg=3, style={"marginTop": 15}
    ),
    dbc.Col(
        [
            dbc.Button("Submeter", id="submit-button", color="info", className="mr-1")
        ],
        md=12, lg=1, style={'text-align': 'center', "marginTop": 15}
    ),
]

CURRENT_DATA = [
    html.Center(html.H1(id='location-header'))
]

INDICATORS = [
    dbc.Col(
        [
            dbc.Card(
                [
                    dbc.CardHeader('CASOS CONFIRMADOS', style={'text-align': 'center'}),
                    dbc.CardBody([html.Div([], id="indicator-cases")])
                ],
                color='info', inverse=True, style={"marginTop": 15},
            ),
        ],
        sm=12, md=6, lg=4, xl=3,
    ),
    dbc.Col(
        [
             dbc.Card(
                [
                    dbc.CardHeader('ÓBITOS CONFIRMADOS', style={'text-align': 'center'}),
                    dbc.CardBody([html.Div([], id="indicator-deaths")])
                ],
                color='danger', inverse=True, style={"marginTop": 15},
            )
        ],
        sm=12, md=6, lg=4, xl=3,
    ),
    dbc.Col(
        [
             dbc.Card(
                [
                    dbc.CardHeader('CRESCIMENTO SEMANAL', style={'text-align': 'center'}),
                    dbc.CardBody([html.Div([], id="indicator-growth")])
                ],
                color='warning', inverse=True, style={"marginTop": 15},
            )
        ],
        sm=12, md=12, lg=4, xl=3
    )
]


GRAPH_CASES = [
    dbc.Col(
        [
            dbc.Card(
                [
                    dbc.CardHeader('Casos acumulados'),
                    dbc.CardBody([html.Div([], id="graph-cases")])
                ]
            ),
        ], sm=12, lg=6, style={"marginTop": 15}
    ), 
    dbc.Col(
        dbc.Card(
            [
                dbc.CardHeader('Óbitos acumulados'),
                dbc.CardBody([html.Div([], id="graph-deaths")])
            ]
        ), sm=12, lg=6, style={"marginTop": 15}
    )
]

CASES_PER_DAY = dbc.Col(
    dbc.Card(
        [
            dbc.CardHeader('Casos por dia de notificação'),
            dbc.CardBody([html.Div([], id="graph-cases-day")])
        ]
    ), sm=12, lg=6, style={"marginTop": 15}
)

DEATHS_PER_DAY = dbc.Col(
    dbc.Card(
        [
            dbc.CardHeader('Óbitos por dia de notificação'),
            dbc.CardBody([html.Div([], id="graph-deaths-day")])
        ]
    ), sm=12, lg=6, style={"marginTop": 15}
)

CASES_PER_WEEK = dbc.Col(
    dbc.Card(
        [
            dbc.CardHeader('Casos por semana epidemiológica'),
            dbc.CardBody([html.Div([], id="graph-cases-week")])
        ]
    ), lg={'order':1, 'size':6}, style={"marginTop": 15}
)

DEATHS_PER_WEEK = dbc.Col(
    dbc.Card(
        [
            dbc.CardHeader('Óbitos por semana epidemiológica'),
            dbc.CardBody([html.Div([], id="graph-deaths-week")])
        ]
    ), lg={'order':12, 'size':6}, style={"marginTop": 15}
)

ABOUT = [
    dbc.Col(
        dbc.Card(
            [
                html.Center(dbc.CardHeader('Fonte dos dados')),
                dbc.CardBody(
                    [
                        html.P("""Os dados do brashboard são provenientes do projeto brasil.io, 
                        que compila os dados das Secretarias Estaduais de Saúde em uma base de dados unificada."""),
                        html.P(["Para mais informações acesse o site: ", html.A('brasil.io', href='https://brasil.io')]),
                        
                    ]
                )
            ]
        ), sm=12, lg=9, style={"marginTop": 15, 'marginBottom': 15}
    ),
    dbc.Col(
        dbc.Card(
            [
                html.Center(dbc.CardHeader('Código fonte')),
                dbc.CardBody(
                    [
                        html.Center(html.A(html.Img(src=GITHUB_LOGO, height='80px'), href=URL_GITHUB))
                    ]
                )
            ]
        ), sm=12, lg=3, style={"marginTop": 15, 'marginBottom': 15}
    )
]

BODY = dbc.Container(
    [
        dbc.Row(DROPDOWNS, justify='center', style={"marginTop": 30}),
        dbc.Row(CURRENT_DATA, justify='center', style={"marginTop": 30}),
        dbc.Spinner(
            [
                dbc.Row(INDICATORS, justify='center', style={"marginTop": 15}),
                dbc.Row(GRAPH_CASES, style={"marginTop": 15}),
                dbc.Row([CASES_PER_WEEK, DEATHS_PER_WEEK], style={"marginTop": 15}),
                dbc.Row([CASES_PER_DAY, DEATHS_PER_DAY], style={"marginTop": 15}),
            ]
        ),
        dbc.Row(html.H2('Sobre o Brashboard'), justify='left', style={"marginTop": 30, 'marginLeft':15}),
        dbc.Row(ABOUT, justify='center', style={"marginTop": 15, "marginBottom": 30})
    ], fluid=True
)

df = get_br_data()
br_date = df.groupby(['date']).sum()
br_date = br_date.reset_index() 
br_ew = df.groupby(['epidemiological_week']).sum()
br_ew = br_ew.reset_index()

app = dash.Dash(__name__, external_stylesheets=[dbc.themes.UNITED],
    meta_tags=[{
        'name': 'viewport',
        'content': 'width=device-width, initial-scale=1.0'
    }],
)

app.title = 'Brashboard: situação do coronavírus nas cidades'

server = app.server

app.layout = dbc.Container([NAVBAR, BODY], fluid=True, style={'padding-right':'0px', 'padding-left':'0px'})

@app.callback(
    [Output('city', 'options'),
    Output('city', 'disabled'),
    Output('city', 'value')],
    [Input('state', 'value')])
def update_dropdowns(state):
    if(state is not None):
        return(get_dropdown_cities(state), False, None)
    else:
        return([], True, None)

@app.callback(
    [Output('graph-cases', 'children'),
    Output('graph-deaths', 'children'),
    Output('graph-cases-day', 'children'),
    Output('graph-deaths-day', 'children'),
    Output('graph-cases-week', 'children'),
    Output('graph-deaths-week', 'children'),
    Output('indicator-cases', 'children'),
    Output('indicator-deaths', 'children'),
    Output('indicator-growth', 'children'),
    Output('location-header', 'children')],

    [Input('submit-button', 'n_clicks')],

    [State('state', 'value'),
    State('city', 'value'),
    State('graph-cases', 'children'),
    State('graph-deaths', 'children'),
    State('graph-cases-day', 'children'),
    State('graph-deaths-day', 'children'),
    State('graph-cases-week', 'children'),
    State('graph-deaths-week', 'children'),
    State('indicator-cases', 'children'),
    State('indicator-deaths', 'children'),
    State('indicator-growth', 'children')])
def update_graphs(click, state, city,
                    children_cases, children_deaths,
                    children_cases_day, children_deaths_day,
                    children_cases_week, children_deaths_week,
                    ind_cases, ind_deaths, ind_growth):
    if(city is not None):
        childrens = generate_graphs(city)
        location = get_ibge_label(city, type='city')
        childrens.append(location)

    else:
        if(state is not None):
            childrens = generate_graphs(state)
            location = get_ibge_label(state, type='state')
            childrens.append(location)
        else:
            # National data
            childrens = []
            location = 'Brasil'
            
            cases  = dcc.Graph(
                figure = generate_scatter_fig(x=br_date['date'], y=br_date['last_available_confirmed'], type='last_available_confirmed'),
                config = {'displayModeBar': False}
            )
            childrens.append(cases)

            deaths = dcc.Graph(
                figure = generate_scatter_fig(x=br_date['date'], y=br_date['last_available_deaths'], type='last_available_deaths'),
                config = {'displayModeBar': False}
            )
            childrens.append(deaths)

            cases_day = dcc.Graph(
                figure = generate_bar_fig(x=br_date['date'], y=br_date['new_confirmed'], type='new_confirmed'),
                config = {'displayModeBar': False}
            )
            childrens.append(cases_day)

            deaths_day = dcc.Graph(
                figure = generate_bar_fig(x=br_date['date'], y=br_date['new_deaths'], type='new_deaths'),
                config = {'displayModeBar': False}
            )
            childrens.append(deaths_day)

            cases_week = dcc.Graph(
                figure = generate_histogram_fig(x=br_ew['epidemiological_week'], y=br_ew['new_confirmed'], type='new_confirmed'),
                config = {'displayModeBar': False}
            )
            childrens.append(cases_week)

            deaths_week = dcc.Graph(
                figure = generate_histogram_fig(x=br_ew['epidemiological_week'], y=br_ew['new_deaths'], type='new_deaths'),
                config = {'displayModeBar': False}
            )
            childrens.append(deaths_week)

            ind_cases = generate_indicator(
                data='{:,d}'.format(br_date.iloc[-1]['last_available_confirmed'].item()).replace(',','.'),
                change='{:,d}'.format(br_date.iloc[-1]['new_confirmed'].item()).replace(',','.'),
                date=br_date.iloc[-1]['date'],
                type='confirmed'
            )
            childrens.append(ind_cases)

            ind_deaths = generate_indicator(
                data='{:,d}'.format(br_date.iloc[-1]['last_available_deaths'].item()).replace(',','.'),
                change='{:,d}'.format(br_date.iloc[-1]['new_deaths'].item()).replace(',','.'),
                date=br_date.iloc[-1]['date'],
                type='deaths'
            )
            childrens.append(ind_deaths)

            current = (br_ew.iloc[-2]['new_confirmed'].item() / POP_BR) * 100000
            last = (br_ew.iloc[-3]['new_confirmed'].item() / POP_BR) * 100000
            ind_growth = generate_growth_indicator(current, last)
            childrens.append(ind_growth)

            childrens.append(location)

    return(childrens)

if __name__ == '__main__':
    app.run_server(debug=True)