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

def generate_scatter_graph(state, city, children, variable):
    if(city is not None):
        # Get city data
        df = get_data(city)
        df.loc[df[variable] < 0, variable] = 0

        fig = generate_scatter_fig(x=df['date'], y=df[variable], type=variable)
        if(children):
            # There was already a children with graph
            children[0]["props"]["figure"] = fig
        else:
            # There wasn't a graph before, so append a children with graph data
            children.append(
                dcc.Graph(
                    figure = fig,
                    config = {'displayModeBar': False}
                )
            )            
    else:
        if(state is not None):
            # Get state data
            df = get_data(state)
            fig = generate_scatter_fig(x=df['date'], y=df[variable], type=variable)
            if(children):
                # There was already a children with graph, so subtitute the children
                children[0]["props"]["figure"] = fig
            else:
                # There wasn't a graph before, so append a children with graph data
                children.append(
                    dcc.Graph(
                        figure = fig,
                        config = {'displayModeBar': False}
                    )
                )
        else:
            # City is not selected and State is not selected, return empty children
            children = []
    return(children)

def generate_bar_graph(state, city, children, variable):
    if(city is not None):
        # Get city data
        df = get_data(city)
        df.loc[df[variable] < 0, variable] = 0
        fig = generate_bar_fig(x=df['date'], y=df[variable], type=variable)
        if(children):
            # There was already a children with graph
            children[0]["props"]["figure"] = fig
        else:
            # There wasn't a graph before, so append a children with graph data
            children.append(
                dcc.Graph(
                    figure = fig,
                    config = {'displayModeBar': False}
                )
            )            
    else:
        if(state is not None):
            # Get state data
            df = get_data(state)
            fig = generate_bar_fig(x=df['date'], y=df[variable], type=variable)
            if(children):
                # There was already a children with graph, so subtitute the children
                children[0]["props"]["figure"] = fig
            else:
                # There wasn't a graph before, so append a children with graph data
                children.append(
                    dcc.Graph(
                        figure = fig,
                        config = {'displayModeBar': False}
                    )
                )
        else:
            # City is not selected and State is not selected, return empty children
            children = []
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
        )
    ),
    dbc.Col(
        dbc.Card(
            [
                dbc.CardHeader('Óbitos acumuladas'),
                dbc.CardBody([html.Div([], id="graph-deaths")])
            ]
        )
    )
]

CASES_PER_DAY = dbc.Col(
    dbc.Card(
        [
            dbc.CardHeader('Casos por dia de notificação'),
            dbc.CardBody([html.Div([], id="graph-cases-day")])
        ]
    )
)

DEATHS_PER_DAY = dbc.Col(
    dbc.Card(
        [
            dbc.CardHeader('Óbitos por dia de notificação'),
            dbc.CardBody([html.Div([], id="graph-deaths-day")])
        ]
    )
)

BODY = dbc.Container(
    [
        dbc.Row([dbc.Col(DROPDOWNS)], style={"marginTop": 30}),
        dbc.Spinner(
            [
                dbc.Row(GRAPH_CASES, style={"marginTop": 30}), 
                dbc.Row([CASES_PER_DAY, DEATHS_PER_DAY], style={"marginTop": 30}),
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
def update_graphs(state, city, children_1, children_2, children_3, children_4):
    children_cases = generate_scatter_graph(state, city, children_1, variable='last_available_confirmed')
    children_deaths = generate_scatter_graph(state, city, children_2, variable='last_available_deaths')
    children_cases_day = generate_bar_graph(state, city, children_3, variable='new_confirmed')
    children_deaths_day = generate_bar_graph(state, city, children_4, variable='new_deaths')
    if(state is None):
        return([], True, children_cases, children_deaths, children_cases_day, children_deaths_day)
    else:
        return(get_dropdown_cities(state), False, children_cases, children_deaths, children_cases_day, children_deaths_day)

if __name__ == '__main__':
    app.run_server(debug=True)