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

def generate_graph_cases(state, city, children):
    if(city is not None):
        # Get city data
        df = get_data(city)
        if(children):
            # There was already a children with graph
            children[0]["props"]["figure"] = {
                'data': [dict(
                    x=df['date'],
                    y=df['last_available_confirmed'],
                    mode='lines+markers',
                    name='Casos Acumulados',
                )],
                'layout': dict(
                    title=df['city'].unique().item()
                ),
            }
        else:
            # There wasn't a graph before, so append a children with graph data
            children.append(
                dcc.Graph(
                    figure = {
                        'data': [dict(
                            x=df['date'],
                            y=df['last_available_confirmed'],
                            mode='lines+markers',
                            name='Casos Acumulados',
                        )],
                        'layout': dict(
                            title=df['city'].unique().item()
                        ),
                    }
                )
            )            
    else:
        if(state is not None):
            # Get state data
            df = get_data(state)
            if(children):
                # There was already a children with graph, so subtitute the children
                children[0]["props"]["figure"] = {
                    'data': [dict(
                        x=df['date'],
                        y=df['last_available_confirmed'],
                        mode='lines+markers',
                        name='Casos Acumulados',
                    )],
                    'layout': dict(
                        title=df['state'].unique().item()
                    ),
                }
            else:
                # There wasn't a graph before, so append a children with graph data
                children.append(
                    dcc.Graph(
                        figure = {
                            'data': [dict(
                                x=df['date'],
                                y=df['last_available_confirmed'],
                                mode='lines+markers',
                                name='Casos Acumulados',
                            )],
                            'layout': dict(
                                title=df['state'].unique().item()
                            ),
                        }
                    )
                )
        else:
            # City is not selected and State is not selected, return empty children
            children = []
    return(children)

def generate_graph_deaths(state, city, children):
    if(city is None):
        if(state is None):
            children = []
        else:
            PARAMS = {'city_ibge_code':state}
            r = requests.get(url = URL_data, params = PARAMS)
            data = r.json()
            data = data['results']
            df = pd.read_json(json.dumps(data))
            if(children):
                children[0]["props"]["figure"] = {
                    'data': [dict(
                        x=df['date'],
                        y=df['last_available_deaths'],
                        mode='lines+markers',
                        line_color="#ff0000",
                        name='Mortes Acumulados',
                    )],
                    'layout': dict(
                        title=df['state'].unique().item()
                    ),
                }
            else:
                children.append(
                    dcc.Graph(
                        figure = {
                            'data': [dict(
                                x=df['date'],
                                y=df['last_available_deaths'],
                                mode='lines+markers',
                                line_color="#ff0000",
                                name='Mortes Acumulados',
                            )],
                            'layout': dict(
                                title=df['state'].unique().item()
                            ),
                        }
                    )
                )
    else:
        PARAMS = {'city_ibge_code':city}
        r = requests.get(url = URL_data, params = PARAMS)
        data = r.json()
        data = data['results']
        df = pd.read_json(json.dumps(data))
        if(children):
            children[0]["props"]["figure"] = {
                'data': [dict(
                    x=df['date'],
                    y=df['last_available_confirmed'],
                    mode='lines+markers',
                    line_color="#ff0000",
                    name='Casos Acumulados',
                )],
                'layout': dict(
                    title=df['city'].unique().item()
                ),
            }
        else:
            children.append(
                dcc.Graph(
                    figure = {
                        'data': [dict(
                            x=df['date'],
                            y=df['last_available_confirmed'],
                            mode='lines+markers',
                            line_color="#ff0000",
                            name='Casos Acumulados',
                        )],
                        'layout': dict(
                            title=df['city'].unique().item()
                        ),
                    }
                )
            )
    return(children)    


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
    dbc.Card(
        dbc.Row(
            [
                dbc.Col(
                    [
                        dcc.Dropdown(
                            id="state",
                            options=get_dropdown_states(),
                            placeholder="Selecione o estado",
                        ),
                    ],
                    md=6, 
                ),
                dbc.Col(
                    [
                        dcc.Dropdown(
                            id="city",
                            options=[],
                            disabled=True, placeholder="Digite o nome da cidade",
                        ),
                    ],
                    md=6,
                ),
            ]
        ),
        body=True,
    )
]


GRAPH_CASES = [
    dbc.CardHeader(html.H5("Casos acumulados")),
    dbc.CardBody(
        [ 
            dbc.Spinner(
                id="loading-cases-graph", color="#3badff",
                children=[
                    dbc.Alert(
                        "Something's gone wrong! Give us a moment, but try loading this page again if problem persists.",
                        id="no-data-alert",
                        color="warning",
                        style={"display": "none"},
                    ),
                    html.Div([], id="graph-cases"),
                    html.Div([], id="graph-deaths")
                ],
            )
        ], style={"marginTop": 0, "marginBottom": 0},
    ),
]

BODY = dbc.Container(
    [
        dbc.Row([dbc.Col(dbc.Card(DROPDOWNS)),], style={"marginTop": 30}),
        dbc.Row([dbc.Col(dbc.Card(GRAPH_CASES)),], style={"marginTop": 30}),
    ],
    className="mt-12",
)

app.layout = html.Div(children=[NAVBAR, BODY])

@app.callback(
    [Output('city', 'options'),
    Output('city', 'disabled'),
    Output('graph-cases', 'children'),
    Output('graph-deaths', 'children')],
    [Input('state', 'value'),
    Input('city', 'value'),],
    [State('graph-cases', 'children'),
    State('graph-deaths', 'children')])
def update_graphs(state, city, children_c, children_d):
    children_cases = generate_graph_cases(state, city, children_c)
    children_deaths = generate_graph_deaths(state, city, children_d)
    if(state is None):
        return([], True, children_cases, children_deaths)
    else:
        return(get_dropdown_cities(state), False, children_cases, children_deaths)

if __name__ == '__main__':
    app.run_server(debug=True)