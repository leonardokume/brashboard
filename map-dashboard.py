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
#Define marginTop
app = dash.Dash(__name__, external_stylesheets=[dbc.themes.UNITED])

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

def generate_graphs(state, city, children_cases, children_deaths, children_cases_day, children_deaths_day):
    if(city is not None):
        # Get city data
        df = get_data(city)
        num = df._get_numeric_data()
        num[num < 0] = 0

        fig1 = generate_scatter_fig(x=df['date'], y=df['last_available_confirmed'], type='last_available_confirmed')
        fig2 = generate_scatter_fig(x=df['date'], y=df['last_available_deaths'], type='last_available_deaths')
        fig3 = generate_bar_fig(x=df['date'], y=df['new_confirmed'], type='new_confirmed')
        fig4 = generate_bar_fig(x=df['date'], y=df['new_deaths'], type='new_deaths')
        if(children_cases):
            # There was already a children with graph
            children_cases[0]["props"]["figure"] = fig1
            children_deaths[0]["props"]["figure"] = fig2
            children_cases_day[0]["props"]["figure"] = fig3
            children_deaths_day[0]["props"]["figure"] = fig4
        else:
            # There wasn't a graph before, so append a children with graph data
            children_cases.append(
                dcc.Graph(
                    figure = fig1,
                    config = {'displayModeBar': False}
                )
            )
            children_deaths.append(
                dcc.Graph(
                    figure = fig2,
                    config = {'displayModeBar': False}
                )
            )
            children_cases_day.append(
                dcc.Graph(
                    figure = fig3,
                    config = {'displayModeBar': False}
                )
            ) 
            children_deaths_day.append(
                dcc.Graph(
                    figure = fig4,
                    config = {'displayModeBar': False}
                )
            )             
    else:
        if(state is not None):
            # Get state data
            df = get_data(state)
            fig1 = generate_scatter_fig(x=df['date'], y=df['last_available_confirmed'], type='last_available_confirmed')
            fig2 = generate_scatter_fig(x=df['date'], y=df['last_available_deaths'], type='last_available_deaths')
            fig3 = generate_bar_fig(x=df['date'], y=df['new_confirmed'], type='new_confirmed')
            fig4 = generate_bar_fig(x=df['date'], y=df['new_deaths'], type='new_deaths')
            if(children_cases):
                # There was already a children with graph, so subtitute the children
                children_cases[0]["props"]["figure"] = fig1
                children_deaths[0]["props"]["figure"] = fig2
                children_cases_day[0]["props"]["figure"] = fig3
                children_deaths_day[0]["props"]["figure"] = fig4
            else:
                # There wasn't a graph before, so append a children with graph data
                children_cases.append(
                    dcc.Graph(
                        figure = fig1,
                        config = {'displayModeBar': False}
                    )
                )
                children_deaths.append(
                    dcc.Graph(
                        figure = fig2,
                        config = {'displayModeBar': False}
                    )
                )
                children_cases_day.append(
                    dcc.Graph(
                        figure = fig3,
                        config = {'displayModeBar': False}
                    )
                ) 
                children_deaths_day.append(
                    dcc.Graph(
                        figure = fig4,
                        config = {'displayModeBar': False}
                    )
                )  
        else:
            # City is not selected and State is not selected, return empty children
            children_cases = []
            children_deaths = []
            children_cases_day = []
            children_deaths_day = []
    return(children_cases, children_deaths, children_cases_day, children_deaths_day)

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
        dbc.Row(
            [
                dbc.Col(
                    [
                        dcc.Dropdown(
                            id="state",
                            options=get_dropdown_states(),
                            value=None, placeholder="Selecione o estado", 
                        ),
                    ],
                    width='3',
                ),
                dbc.Col(
                    [
                        dcc.Dropdown(
                            id="city",
                            options=[],
                            value=None, placeholder="Digite o nome da cidade", disabled=True,
                        ),
                    ],
                    width='3',
                ),
            ], justify='center',
        ),
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

BODY = dbc.Container(
    [
        dbc.Row([dbc.Col(DROPDOWNS)], style={"marginTop": 30}),
        dbc.Spinner(
            [
                dbc.Row(GRAPH_CASES, style={"marginTop": 15}), 
                dbc.Row([CASES_PER_DAY, DEATHS_PER_DAY], style={"marginTop": 15}),
            ] 
        )
    ],
    fluid=True,
)

app.layout = html.Div(children=[NAVBAR, BODY])

@app.callback(
    [Output('city', 'options'),
    Output('city', 'disabled'),
    Output('graph-cases', 'children'),
    Output('graph-deaths', 'children'),
    Output('graph-cases-day', 'children'),
    Output('graph-deaths-day', 'children')],
    [Input('state', 'value'),
    Input('city', 'value'),],
    [State('graph-cases', 'children'),
    State('graph-deaths', 'children'),
    State('graph-cases-day', 'children'),
    State('graph-deaths-day', 'children')])
def update_graphs(state, city, children_cases, children_deaths, children_cases_day, children_deaths_day):
    children_cases, children_deaths, children_cases_day, children_deaths_day = generate_graphs(state, city, children_cases, children_deaths, children_cases_day, children_deaths_day)
    if(state is None):
        return([], True, children_cases, children_deaths, children_cases_day, children_deaths_day)
    else:
        return(get_dropdown_cities(state), False, children_cases, children_deaths, children_cases_day, children_deaths_day)

if __name__ == '__main__':
    app.run_server(debug=True)