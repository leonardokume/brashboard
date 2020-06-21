import dash
import requests
import pandas as pd
import json
import dash_core_components as dcc
import dash_html_components as html
import dash_bootstrap_components as dbc
from dash.dependencies import Input, Output, State

URL_data = 'https://brasil.io/api/dataset/covid19/caso_full/data/'
URL_ibge = 'https://raw.githubusercontent.com/leonardokume/covid-br-dashboard/master/dados/cities_ibge_code.csv'
PLOTLY_LOGO = "https://images.plot.ly/logo/new-branding/plotly-logomark.png"
LAURA_LOGO = 'https://www.laura-br.com/wp-content/themes/Laura/images/logo.png'
EXTERNAL_STYLESHEETS = ["https://codepen.io/chriddyp/pen/bWLwgP.css"]

ibge = pd.read_csv(URL_ibge)
ibge['value'] = ibge['value'].astype(str)
ibge['value'] = ibge['value'].str.replace('.0', '', regex=False)
city_dropdown_options = ibge.drop(labels=['type', 'state'], axis=1).to_dict('records')

NAVBAR = dbc.Navbar(
    children=[
        html.A(
            # Use row and col to control vertical alignment of logo / brand
            dbc.Row(
                [
                    #dbc.Col(html.Img(src=LAURA_LOGO, height="35px")),
                    dbc.Col(
                        dbc.NavbarBrand("Situação da COVID-19 nas cidades", className="ml-2"), width="300px"
                    ),
                ],
                align="center",
                no_gutters=True,
            ),
            #href="https://laura-br.com",
        )
    ],
    color="#004c82",
    dark=True,
    sticky="top",
)

DROPDOWNS = [
    dbc.CardHeader(html.H5("Escolha sua cidade")),
    dbc.CardBody(
        [
            dbc.Row(
                [
                    dbc.Col(
                        [
                            dcc.Dropdown(
                                id="state",
                                options=[
                                    
                                ],
                                value="",
                            )
                        ],
                        md=6,
                    ),
                    dbc.Col(
                        [
                            dcc.Dropdown(
                                id="city",
                                options=[
                                    {"label": i, "value": i}
                                    for i in ibge.label
                                ],
                                value="",
                            )
                        ],
                        md=6,
                    ),
                ]
            ),
        ], style={"marginTop": 0, "marginBottom": 0},
    ),
]


GRAPH_CASES = [
    dbc.CardHeader(html.H5("Casos acumulados")),
    dbc.CardBody(
        [ 
            dcc.Loading(
                id="loading-cases-graph",
                children=[
                    dbc.Alert(
                        "Something's gone wrong! Give us a moment, but try loading this page again if problem persists.",
                        id="no-data-alert",
                        color="warning",
                        style={"display": "none"},
                    ),
                    html.Div([], id="graph-cases")
                ],
                type="default",
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

app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])

app.layout = html.Div(children=[NAVBAR, BODY])

@app.callback(
    Output('graph-cases', 'children'),
    [Input('city', 'value')],
    [State('graph-cases', 'children')])
def update_figure(city, children):
    try:
        PARAMS = {'city':city}
        r = requests.get(url = URL_data, params = PARAMS)
        data = r.json()
        data = data['results']
        df = pd.read_json(json.dumps(data))
        if(children):
            PARAMS = {'city':city}
            r = requests.get(url = URL_data, params = PARAMS)
            data = r.json()
            data = data['results']
            df = pd.read_json(json.dumps(data))

            children[0]["props"]["figure"] = {
                'data': [dict(
                    x=df['date'],
                    y=df['last_available_confirmed'],
                    mode='lines+markers',
                    name='Casos Acumulados',
                )],
                'layout': dict(
                    title=df['city'].unique().item()
                )
            }
        else:
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
                        )
                    }
                )
            )
    except:
        children = []
    return(children)
if __name__ == '__main__':
    app.run_server(debug=True)