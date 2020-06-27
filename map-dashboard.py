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
URL_ibge = 'https://raw.githubusercontent.com/leonardokume/covid-br-dashboard/master/dados/cities_ibge_code.csv'
BRA_FLAG = 'https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg'

def add_sep(s, sep='.'):
   return s if len(s) <= 3 else add_sep(s[:-3], sep) + sep + s[-3:]

def get_dropdown_states():
    ibge = pd.read_csv('./dados/cities_ibge_code.csv')
    states = ibge.loc[ibge['type']=='state']
    states['value'] = states['value'].astype(str)
    states['value'] = states['value'].str.replace('.0', '', regex=False)
    dropdown = states.drop(labels=['type', 'state'], axis=1).to_dict('records')
    return(dropdown)

def get_dropdown_cities(state):
    ibge = pd.read_csv('./dados/cities_ibge_code.csv')
    state_abr = ibge.loc[ibge['value']==int(state)].state.item()
    cities = ibge.loc[(ibge['type']=='city') & (ibge['state']==state_abr)]
    cities['value'] = cities['value'].astype(str)
    cities['value'] = cities['value'].str.replace('.0', '', regex=False)
    dropdown = cities.drop(labels=['type', 'state'], axis=1).to_dict('records')
    return(dropdown)

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
    df
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
                        fillcolor=fcolor
                        )]
                    )
    fig.update_layout(
        margin=dict(l=0, r=0, t=0, b=0),
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
                        )]
                    )
    fig.update_layout(
        margin=dict(l=0, r=0, t=0, b=0),
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
        autobinx = False
        )]
    )
    fig.update_layout(
        margin=dict(l=0, r=0, t=0, b=0),
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        yaxis=dict(gridcolor='#d6d6d6'),
        xaxis_range=(x.min()-0.5, x.max()+0.5),
        xaxis_dtick=1,
        bargap=0.2
    )
    return(fig)

def generate_indicator(data, change):
    fig = [
        html.Center(html.H2(add_sep(str(data)))),
        html.Center(html.H3('+ {}'.format(add_sep(str(change)))))
    ]
    return(fig)

def generate_graphs(state, city, children_cases, children_deaths, children_cases_day, children_deaths_day, children_cases_week, children_deaths_week, ind_cases, ind_deaths):
    if(city is not None):
        # Get city data
        df = get_data(city)
        num = df._get_numeric_data()
        num[num < 0] = 0

        fig1 = generate_scatter_fig(x=df['date'], y=df['last_available_confirmed'], type='last_available_confirmed')
        fig2 = generate_scatter_fig(x=df['date'], y=df['last_available_deaths'], type='last_available_deaths')
        fig3 = generate_bar_fig(x=df['date'], y=df['new_confirmed'], type='new_confirmed')
        fig4 = generate_bar_fig(x=df['date'], y=df['new_deaths'], type='new_deaths')
        fig5 = generate_histogram_fig(x=df['epidemiological_week'], y=df['new_confirmed'], type='new_confirmed')
        fig6 = generate_histogram_fig(x=df['epidemiological_week'], y=df['new_deaths'], type='new_deaths')
        ind_cases = generate_indicator(
            data=df.loc[df['is_last']==True, 'last_available_confirmed'].item(),
            change=df.loc[df['is_last']==True, 'new_confirmed'].item())
        ind_deaths = generate_indicator(
            data=df.loc[df['is_last']==True, 'last_available_deaths'].item(),
            change=df.loc[df['is_last']==True, 'new_deaths'].item())

        children_cases = dcc.Graph(
            figure = fig1,
            config = {'displayModeBar': False}
        )
        children_deaths = dcc.Graph(
            figure = fig2,
            config = {'displayModeBar': False}
        )
        children_cases_day = dcc.Graph(
            figure = fig3,
            config = {'displayModeBar': False}
        )
        
        children_deaths_day = dcc.Graph(
            figure = fig4,
            config = {'displayModeBar': False}
        )
        
        children_cases_week = dcc.Graph(
            figure = fig5,
            config = {'displayModeBar': False}
        )
        children_deaths_week = dcc.Graph(
            figure = fig6,
            config = {'displayModeBar': False}
        )
    else:
        if(state is not None):
            # Get state data
            df = get_data(state)
            num = df._get_numeric_data()
            num[num < 0] = 0
            
            fig1 = generate_scatter_fig(x=df['date'], y=df['last_available_confirmed'], type='last_available_confirmed')
            fig2 = generate_scatter_fig(x=df['date'], y=df['last_available_deaths'], type='last_available_deaths')
            fig3 = generate_bar_fig(x=df['date'], y=df['new_confirmed'], type='new_confirmed')
            fig4 = generate_bar_fig(x=df['date'], y=df['new_deaths'], type='new_deaths')
            fig5 = generate_histogram_fig(x=df['epidemiological_week'], y=df['new_confirmed'], type='new_confirmed')
            fig6 = generate_histogram_fig(x=df['epidemiological_week'], y=df['new_deaths'], type='new_deaths')
            ind_cases = generate_indicator(
                data=df.loc[df['is_last']==True, 'last_available_confirmed'].item(),
                change=df.loc[df['is_last']==True, 'new_confirmed'].item())
            ind_deaths = generate_indicator(
                data=df.loc[df['is_last']==True, 'last_available_deaths'].item(),
                change=df.loc[df['is_last']==True, 'new_deaths'].item())
            
            children_cases = dcc.Graph(
                figure = fig1,
                config = {'displayModeBar': False}
            )
            children_deaths = dcc.Graph(
                figure = fig2,
                config = {'displayModeBar': False}
            )
            children_cases_day = dcc.Graph(
                figure = fig3,
                config = {'displayModeBar': False}
            )
            children_deaths_day = dcc.Graph(
                figure = fig4,
                config = {'displayModeBar': False}
            )
            children_cases_week = dcc.Graph(
                figure = fig5,
                config = {'displayModeBar': False}
            )
            children_deaths_week = dcc.Graph(
                figure = fig6,
                config = {'displayModeBar': False}
            )
        else:
            # City is not selected and State is not selected, return empty children
            
            fig1 = generate_scatter_fig(x=br_date['date'], y=br_date['last_available_confirmed'], type='last_available_confirmed')
            fig2 = generate_scatter_fig(x=br_date['date'], y=br_date['last_available_deaths'], type='last_available_deaths')
            fig3 = generate_bar_fig(x=br_date['date'], y=br_date['new_confirmed'], type='new_confirmed')
            fig4 = generate_bar_fig(x=br_date['date'], y=br_date['new_deaths'], type='new_deaths')
            fig5 = generate_histogram_fig(x=br_ew['epidemiological_week'], y=br_ew['new_confirmed'], type='new_confirmed')
            fig6 = generate_histogram_fig(x=br_ew['epidemiological_week'], y=br_ew['new_deaths'], type='new_deaths')
            ind_cases = generate_indicator(
                data=br_date.iloc[-1]['last_available_confirmed'].item(),
                change=br_date.iloc[-1]['new_confirmed'].item()
            )
            ind_deaths = generate_indicator(
                data=br_date.iloc[-1]['last_available_deaths'].item(),
                change=br_date.iloc[-1]['new_deaths'].item()
            )

            children_cases  = dcc.Graph(
                figure = fig1,
                config = {'displayModeBar': False}
            )
            children_deaths = dcc.Graph(
                figure = fig2,
                config = {'displayModeBar': False}
            )
            children_cases_day = dcc.Graph(
                figure = fig3,
                config = {'displayModeBar': False}
            )
            children_deaths_day = dcc.Graph(
                figure = fig4,
                config = {'displayModeBar': False}
            )
            children_cases_week = dcc.Graph(
                figure = fig5,
                config = {'displayModeBar': False}
            )
            children_deaths_week = dcc.Graph(
                figure = fig6,
                config = {'displayModeBar': False}
            )
    return(children_cases, children_deaths, children_cases_day, children_deaths_day, children_cases_week, children_deaths_week, ind_cases, ind_deaths)

NAVBAR = dbc.Navbar(
    children=[
        html.A(
            dbc.Row(
                [
                    dbc.Col(html.Img(src=BRA_FLAG, height="35px")),
                    dbc.Col(
                        dbc.NavbarBrand("SITUAÇÃO DO CORONAVÍRUS NAS CIDADES", className="ml-2"), width="300px"
                    ),
                ],
                align="center",
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
        sm=12, lg=3, style={"marginTop": 15}
    ),
    dbc.Col(
        [
            dcc.Dropdown(
                id="city",
                options=[],
                value=None, placeholder="Digite o nome da cidade", disabled=True,
            ),
        ],
        sm=12, lg=3, style={"marginTop": 15}
    ),
    dbc.Col(
        [
            dbc.Button("Submeter", id="submit-button", color="info", className="mr-1")
        ],
        sm=6, lg=1, style={'text-align': 'center', "marginTop": 15}
    ),
]

INDICATORS = [
    dbc.Col(
        [
            dbc.Card(
                [
                    dbc.CardHeader('CASOS ACUMULADOS', style={'text-align': 'center'}),
                    dbc.CardBody([html.Div([], id="indicator-cases")])
                ],
                color='info', inverse=True, style={"marginTop": 15},
            ),
        ],
        sm=3, lg=3,
    ),
    dbc.Col(
        [
             dbc.Card(
                [
                    dbc.CardHeader('ÓBITOS ACUMULADOS', style={'text-align': 'center'}),
                    dbc.CardBody([html.Div([], id="indicator-deaths")])
                ],
                color='danger', inverse=True, style={"marginTop": 15},
            )
        ],
        sm=3, lg=3,
    )
]


GRAPH_CASES = [
    dbc.Col(
        dbc.Card(
            [
                dbc.CardHeader('Casos acumulados'),
                dbc.CardBody([html.Div([], id="graph-cases")])
            ]
        ), lg={'order':1, 'size':6}, style={"marginTop": 15}
    ), 
    dbc.Col(
        dbc.Card(
            [
                dbc.CardHeader('Óbitos acumulados'),
                dbc.CardBody([html.Div([], id="graph-deaths")])
            ]
        ), lg={'order':12, 'size':6}, style={"marginTop": 15}
    )
]

CASES_PER_DAY = dbc.Col(
    dbc.Card(
        [
            dbc.CardHeader('Casos por dia de notificação'),
            dbc.CardBody([html.Div([], id="graph-cases-day")])
        ]
    ), lg={'order':1, 'size':6}, style={"marginTop": 15}
)

DEATHS_PER_DAY = dbc.Col(
    dbc.Card(
        [
            dbc.CardHeader('Óbitos por dia de notificação'),
            dbc.CardBody([html.Div([], id="graph-deaths-day")])
        ]
    ), lg={'order':12, 'size':6}, style={"marginTop": 15}
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

BODY = dbc.Container(
    [
        dbc.Row(DROPDOWNS, justify='center', style={"marginTop": 30}),
        dbc.Spinner(
            [
                dbc.Row(INDICATORS, justify='center', style={"marginTop": 15}),
                dbc.Row(GRAPH_CASES, style={"marginTop": 15}), 
                dbc.Row([CASES_PER_DAY, DEATHS_PER_DAY], style={"marginTop": 15}),
                dbc.Row([CASES_PER_WEEK, DEATHS_PER_WEEK], style={"marginTop": 15}),
            ] 
        )
    ],
    fluid=True,
)

df = get_br_data()
br_date = df.groupby(['date']).sum()
br_date = br_date.reset_index()
br_ew = df.groupby(['epidemiological_week']).sum()
br_ew = br_ew.reset_index()

app = dash.Dash(__name__, external_stylesheets=[dbc.themes.UNITED])

app.layout = html.Div(children=[NAVBAR, BODY])

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
    Output('indicator-deaths', 'children')],

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
    State('indicator-deaths', 'children')])
def update_graphs(click, state, city, children_cases, children_deaths,
                    children_cases_day, children_deaths_day,
                    children_cases_week, children_deaths_week,
                    ind_cases, ind_deaths):
    children_cases, children_deaths, children_cases_day, children_deaths_day, children_cases_week, children_deaths_week, ind_cases, ind_deaths = generate_graphs(
        state, city, children_cases, children_deaths, children_cases_day, children_deaths_day, children_cases_week, children_deaths_week, ind_cases, ind_deaths)

    if(state is None):
        return(children_cases, children_deaths, children_cases_day, children_deaths_day, children_cases_week, children_deaths_week, ind_cases, ind_deaths)
    else:
        return(children_cases, children_deaths, children_cases_day, children_deaths_day, children_cases_week, children_deaths_week, ind_cases, ind_deaths)

if __name__ == '__main__':
    app.run_server(debug=True)