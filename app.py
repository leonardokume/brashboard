import dash
import requests
import pandas as pd
import numpy as np
import json
import dash_core_components as dcc
import dash_html_components as html
import dash_bootstrap_components as dbc
import plotly.graph_objects as go
from dash.dependencies import Input, Output, State
from datetime import datetime

pd.set_option('mode.chained_assignment', None)

URL_DATA = 'https://data.brasil.io/dataset/covid19/caso_full.csv.gz'
URL_GITHUB = 'https://github.com/leonardokume/brashboard'
LOGO = './assets/logo.png'
GITHUB_LOGO = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png'
POP_BR = 210147125
STATES = pd.read_csv('./dados/states_ibge_codes.csv')
MAVG_WINDOW = 14

def download_data():
    r = requests.get(URL_DATA, stream=True)
    df = []
    for chunk in pd.read_csv(
        r.raw, compression='gzip', header=0, sep=',', quotechar='"', chunksize=5000,
            dtype={
            'city':'category',
            'place_type':'category',
            'state':'category',
            'city_ibge_code':'Int32',
            'epidemiological_week':'Int32',
            'estimated_population':'Int32',
            'last_available_confirmed':'Int32',
            'last_available_deaths':'Int32',
            'new_confirmed':'Int32',
            'new_deaths':'Int32',
        },
        usecols=[
            'city',
            'city_ibge_code',
            'epidemiological_week',
            'estimated_population',
            'is_last',
            'last_available_confirmed',
            'last_available_deaths',
            'place_type',
            'state',
            'new_confirmed',
            'new_deaths'
        ]):
        df.append(chunk)
    df = pd.concat(df)
    return(df)

DF = download_data()
CITIES = DF[["city", "city_ibge_code", "place_type", "state"]].drop_duplicates().sort_values(by="city").dropna()
CITIES = CITIES.loc[CITIES["place_type"] == "city"]
CITIES = CITIES.rename(columns={"city":"label", "city_ibge_code":"value"})

def get_dropdown_states():
    """Returns a dictionary with states labels and IBGE codes"""
    dropdown = STATES.drop(labels=['state'], axis=1).to_dict('records')
    return(dropdown)

def get_dropdown_cities(state):
    """Returns a dictionary with cities labels and IBGE codes"""
    state_abr = STATES.loc[STATES['value']==state].state.item()
    state_cities = CITIES.loc[CITIES['state']==state_abr]
    dropdown = state_cities.drop(labels=['place_type', 'state'], axis=1).to_dict('records')
    return(dropdown)

def get_ibge_label(ibge_code, type):
    """Returns a string containing the label from an IBGE code"""
    if(type == 'city'):
        label = CITIES.loc[CITIES['value'] == int(ibge_code)].label.item()
        label = '{} ({})'.format(label, CITIES.loc[CITIES['value'] == int(ibge_code)].state.item())
    else:
        label = STATES.loc[STATES['value'] == int(ibge_code)].label.item()
    return(label)

def get_data(ibge_code):
    """Returns a dataframe with the data from an IBGE code"""
    df = DF.loc[DF['city_ibge_code'] == ibge_code]
    df['cases_moving_average'] = moving_average(df['new_confirmed'], MAVG_WINDOW)
    df['deaths_moving_average'] = moving_average(df['new_deaths'], MAVG_WINDOW)
    return (df)

def get_br_data():
    """Returns a dataframe with the national data"""
    PARAMS = {'place_type':'state', 'page_size':'10000'}
    r = requests.get(url = URL_DATA, params = PARAMS)
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

def generate_bar_fig(x, y, mavg, type):
    if(type == 'new_confirmed'):
        color = '#008cff'
        trace_color = '#ff0000'
    else:
        color = '#ff0000'
        trace_color = '#000'

    fig = go.Figure(data=[go.Bar(
        showlegend=False,
        name='Novos casos',
        x=x,
        y=y,
        marker_color=color,
        hovertemplate = '%{x}: %{y:.3s}<extra></extra>'
        )]
    )

    fig.add_trace(go.Scatter(
        name='Média móvel (14 dias)',
        x=x,
        y=mavg,
        marker_color=trace_color,
        hovertemplate = '%{x}: %{y:.3s}<extra></extra>'
    ))

    fig.update_layout(
        legend=dict(
            x=0.01,
            y=1),
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

    x1 = x.astype(str).str.slice(4, 6)
    current_ew = int(x1.iloc[-1])

    ew20 = pd.Series([str(x).zfill(2) for x in range(1, 54)])
    ew21 = pd.Series([str(x).zfill(2) for x in range(1, current_ew+1)])
    ews = pd.concat([ew20, ew21])
    y20 = pd.Series([2020]*len(ew20))
    y21 = pd.Series([2021]*len(ew21))
    ys = pd.concat([y20, y21])
    df_ew = pd.DataFrame({"ew":ews, "year":ys})
    df_ew['ew_int'] = df_ew['year'].astype(str) + df_ew['ew'].astype(str)
    df_ew['ew_int'] = df_ew['ew_int'].astype(int)

    df_hist = pd.DataFrame({'ew_int':x, 'y':y})
    df_hist = pd.merge(df_ew, df_hist, how='left', on='ew_int')

    fig = go.Figure(data=[go.Histogram(
        histfunc="sum",
        x=[df_hist['year'],df_hist['ew']],
        y=df_hist['y'].fillna(0),
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
        #xaxis_range=(x.min()-0.5, x.max()+0.5),
        xaxis_dtick=2,
        bargap=0.2
    )
    return(fig)

def generate_indicator(data, change, date, type):
    date = datetime.strptime(date, "%Y-%m-%d")
    if(type == 'deaths'):
        fig = [
            html.Center(
                [
                    html.H2(data),
                    html.H6('Óbitos totais'),
                    html.Center(html.H3(change)),
                    html.H6(f'Novos óbitos em {date:%d/%m}')
                ]
            )
        ]
    elif(type == 'confirmed'):
        fig = [
            html.Center(
                [
                    html.H2(data),
                    html.H6('Casos totais'),
                    html.Center(html.H3(change)),
                    html.H6(f'Novos casos em {date:%d/%m}')
                ]
            )
        ]
    elif(type == 'letality'):
        fig = [
            html.Center(
                [
                    html.H2(data),
                    html.H6('Óbitos por 100 mil habitantes'),
                    html.Center(html.H3(change)),
                    html.H6('Taxa de letalidade')
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
                    html.H6('Novos casos a cada 100 mil habitantes')
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
                    html.H6('Novos casos a cada 100 mil habitantes')
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
    pop = df['estimated_population'].iloc[0].item()
    current = (group_ew.iloc[-2].item() / pop) * 100000
    last = (group_ew.iloc[-3].item() / pop) * 100000
    return(current, last)

def get_letality_data(df):
    pop = df['estimated_population'].iloc[0].item()
    total_deaths = df.loc[df['is_last']==True, 'last_available_deaths'].item()
    total_confirmed = df.loc[df['is_last']==True, 'last_available_confirmed'].item()
    mortality =  (total_deaths / pop) * 100000
    letality = (total_deaths / total_confirmed) * 100
    return(mortality, letality)

def moving_average(data, window):
    mov_avg = []
    for i in range(len(data)):
        if(i + window > len(data)):
            mov_avg.append(np.mean(data[i:len(data)]))
        else:
            mov_avg.append(np.mean(data[i:i+window]))
    return(mov_avg)

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
        figure = generate_bar_fig(x=df['date'], y=df['new_confirmed'], mavg=df['cases_moving_average'], type='new_confirmed'),
        config = {'displayModeBar': False}
    )
    childrens.append(cases_day)

    deaths_day = dcc.Graph(
        figure = generate_bar_fig(x=df['date'], y=df['new_deaths'], mavg=df['deaths_moving_average'], type='new_deaths'),
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

    mortality, letality = get_letality_data(df)
    ind_letality = generate_indicator(
        data='{:,.2f}'.format(mortality).replace('.', ','),
        change='{:,.2f}%'.format(letality).replace('.',','),
        date=df.loc[df['is_last']==True, 'date'].item(),
        type='letality'
    )
    childrens.append(ind_letality)

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
            dbc.Button("Enviar", id="submit-button", color="info", className="mr-1")
        ],
        md=12, lg=1, style={'text-align': 'center', "marginTop": 15}
    ),
]

LOCATION_LABEL = [
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
        sm=12, md=6, lg=4, xl=3
    ),
    dbc.Col(
        [
             dbc.Card(
                [
                    dbc.CardHeader('LETALIDADE', style={'text-align': 'center'}),
                    dbc.CardBody([html.Div([], id="indicator-letality")])
                ],
                color='dark', inverse=True, style={"marginTop": 15},
            )
        ],
        sm=12, md=6, lg=4, xl=3
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
    ), sm=12, lg=6, style={"marginTop": 15}
)

DEATHS_PER_WEEK = dbc.Col(
    dbc.Card(
        [
            dbc.CardHeader('Óbitos por semana epidemiológica'),
            dbc.CardBody([html.Div([], id="graph-deaths-week")])
        ]
    ), sm=12, lg=6, style={"marginTop": 15}
)

ABOUT = [
    dbc.Col(
        dbc.Card(
            [
                html.Center(dbc.CardHeader('Fonte dos dados')),
                dbc.CardBody(
                    [
                        html.P(["Os dados do brashboard são provenientes do projeto ", html.A('brasil.io', href='https://brasil.io'),
                        ", que compila os dados das Secretarias Estaduais de Saúde em uma base de dados unificada."])                   
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
                        html.Center(html.A(html.Img(src=GITHUB_LOGO, height='40px'), href=URL_GITHUB))
                    ]
                )
            ]
        ), sm=12, lg=2, style={"marginTop": 15, 'marginBottom': 15}
    )
]

BODY = dbc.Container(
    [
        dbc.Row(DROPDOWNS, justify='center', style={"marginTop": 30}),
        dbc.Spinner(
            [
                dbc.Row(LOCATION_LABEL, justify='center', style={"marginTop": 30}),
                dbc.Row(INDICATORS, justify='center', style={"marginTop": 15}),
                dbc.Row(GRAPH_CASES, style={"marginTop": 15}),
                dbc.Row([CASES_PER_WEEK, DEATHS_PER_WEEK], style={"marginTop": 15}),
                dbc.Row([CASES_PER_DAY, DEATHS_PER_DAY], style={"marginTop": 15}),
            ]
        ),
        dbc.Row(html.H2('Sobre o Brashboard'), justify='center', style={"marginTop": 30, 'marginLeft':15}),
        dbc.Row(ABOUT, justify='center', style={"marginTop": 15, "marginBottom": 30})
    ], fluid=True
)

# National data is calculated from the sum of the data from all state
br_date = DF.groupby(['date']).sum()
br_date = br_date.reset_index()
br_date = br_date.reindex(index=br_date.index[::-1])
br_date['cases_moving_average'] = moving_average(br_date['new_confirmed'], MAVG_WINDOW)
br_date['deaths_moving_average'] = moving_average(br_date['new_deaths'], MAVG_WINDOW)
br_date = br_date.reindex(index=br_date.index[::-1])
br_ew = DF.groupby(['epidemiological_week']).sum()
br_ew = br_ew.reset_index()

app = dash.Dash(__name__, external_stylesheets=[dbc.themes.UNITED],
    meta_tags=[
        {
            'name': 'viewport',
            'content': 'width=device-width, initial-scale=1.0'
        },
        {
            'name':'google-site-verification',
            'content':'bWc3qO1Kvej2eSTItnsNmF_6sgpe_yKTOtlrwvjVP6M'
        },
        {
            'name':'description',
            'content':'Consulte o número de casos, óbitos e evolução da pandemia de COVID-19 na sua cidade.'
        }
    ],
)

app.title = 'Brashboard: situação do coronavírus nas cidades'

app.index_string = '''
<!DOCTYPE html>
<html>
    <head>
       <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-171052480-1"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-171052480-1');
        </script>
        {%metas%}
        <title>{%title%}</title>
        {%favicon%}
        {%css%}
    </head>
    <body>
        {%app_entry%}
        <footer>
            {%config%}
            {%scripts%}
            {%renderer%}
        </footer>
    </body>
</html>
'''

server = app.server

app.layout = dbc.Container([NAVBAR, BODY], fluid=True, style={'padding-right':'0px', 'padding-left':'0px'})

# Callback to update city dropdown only when a state is selected
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

# Callback to update the graphs only after the submit button is pressed
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
    Output('indicator-letality', 'children'),
    Output('location-header', 'children')],

    [Input('submit-button', 'n_clicks')],

    [State('state', 'value'),
    State('city', 'value')])
def update_graphs(click, state, city):
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
                figure = generate_bar_fig(x=br_date['date'], y=br_date['new_confirmed'], mavg=br_date['cases_moving_average'], type='new_confirmed'),
                config = {'displayModeBar': False}
            )
            childrens.append(cases_day)

            deaths_day = dcc.Graph(
                figure = generate_bar_fig(x=br_date['date'], y=br_date['new_deaths'], mavg=br_date['deaths_moving_average'], type='new_deaths'),
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

            mortality = (br_date.iloc[-1]['last_available_deaths'].item() / POP_BR) * 100000
            letality = (br_date.iloc[-1]['last_available_deaths'].item() / br_date.iloc[-1]['last_available_confirmed'].item()) * 100
            ind_letality = generate_indicator(
                data='{:,.2f}'.format(mortality).replace('.', ','),
                change='{:,.2f}%'.format(letality).replace('.',','),
                date=br_date.iloc[-1]['date'],
                type='letality'
            )
            childrens.append(ind_letality)

            childrens.append(location)

    return(childrens)

if __name__ == '__main__':
    app.run_server(debug=True)