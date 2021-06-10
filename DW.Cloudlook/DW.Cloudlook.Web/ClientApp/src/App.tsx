import "./styles/global.css";

import * as React from "react";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { AppScreen } from "./AppScreen";
import { CloudlookService } from "./services";
import { ICloudlookService } from "./services/contracts";
import { initializeIcons } from '@uifabric/icons';

export interface AppProps { }
export interface AppState {
  loading: boolean;
  token: string;
  bootstrapToken: string;
  userId: string
}

export default class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
    this.state = {
      loading: true,
      token: "",
      bootstrapToken : "",
      userId: ""
    };
  }

  componentDidMount = async () => {
    let bootstrapToken: string = await OfficeRuntime.auth.getAccessToken()
    let userMail: string = Office.context.mailbox.userProfile.emailAddress
    let cloudlookService: ICloudlookService = new CloudlookService("https://localhost:44381", bootstrapToken);
    let cloudlookToken = await cloudlookService.requireobotoken("https://graph.microsoft.com");
  
    this.setState({ 
      loading: false,
      token: cloudlookToken, 
      bootstrapToken: bootstrapToken, 
      userId: userMail 
    });
    initializeIcons();
  };

  render = () => {
    if (this.state.loading) {
      return (
        <Spinner label="Loading..." size={SpinnerSize.large} />
      );
    }
    
    return (
      <AppScreen token={this.state.token} bootstrapToken={this.state.bootstrapToken} userId={this.state.userId} />
    );
  }
}
