import * as core from '@actions/core';
import getInputs from './utils/getInputs';
import axios from 'axios';
import { connected } from 'process';
// import { repoPRFetch } from './utils/repoPRFetch'

const handleError = (err: Error) => {
  core.error(err);
  core.setFailed(`Unhandled error: ${err}`);
};

process.on('unhandledRejection', handleError);

const run = async (): Promise<void> => {
  const combinePullsParams = await getInputs();
  const { githubToken } = combinePullsParams;
  core.info("Started Analysing CodeQL Reports....")
  try {
    const { data } = (await axios.get(`${process.env.GITHUB_API_URL}/repos/${process.env.GITHUB_REPOSITORY}/code-scanning/alerts?ref=${process.env.GITHUB_REF_NAME}`, {
        headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/json' },
    }));
    if(data.length > 0) {
      var openAlerts = data.filter(function(data : any){
        return data.state == 'open';
      });
      //console.log(openAlerts)
      if(openAlerts.length > 0) {
        core.info("There is/are " + openAlerts.length + " Open Alerts")
        openAlerts.forEach( (data: any) => {
          core.warning("Open Alert name is "+ data.rule.name + ","
            + "Open Alert description is "+ data.rule.description + ","
            + "Open Alert severity is "+ data.rule.severity + ","
            + "Open Alert severity level is "+ data.rule.security_severity_level)
         })
         //FAIL the process here
         core.setFailed("Action Failed due to above issues ☝")
      } else {
        var dismissedAlerts = data.filter(function(data : any){
          return data.state == 'dismissed';
        });
        core.info("There is/are " + dismissedAlerts.length + " Dismissed Alerts")
        if(dismissedAlerts.length > 0 ){
          var falsePositiveAlerts = dismissedAlerts.filter(function(data : any){
            return data.dismissed_reason == 'false positive';
          });
          core.info("There is/are " + falsePositiveAlerts.length + " False Positive Alerts")
          if(falsePositiveAlerts.length > 0){
            if(dismissedAlerts.length === falsePositiveAlerts.length){
              //PASS the process here
              core.info("Skipping the Action.... because Alerts are marked as FalsePositive")
            } else {
              //FAIL the process here
              core.setFailed("Dismissed Alerts are more than the FalsePositive Alerts")
            }
          } else {
            //FAIL the process here
            core.setFailed("Action Failed due to Dismissed Alerts present and needs to be fixed")
          } 
        } else {
          //PASS the process here
          core.info("No Dismissed Alerts found")
        }
      }
    } else {
      //PASS the process here
      core.info("No Open Alerts found")
    }
   
    //     // const combinePullsParams = await getInputs();
    //     // const { githubToken } = combinePullsParams;
    //     // const githubClient = getOctokit(githubToken);
  
    //     // await execa('git', ['config', 'user.name', 'github-actions']);
    //     // await execa('git', ['config', 'user.email', 'github-actions@github.com']);
  
    //     // await combinePRs(githubClient, context.repo, combinePullsParams);
   
  } catch (err) {
    core.setFailed(`combine-dependabot-branch: ${(err as Error).message}`);
  }
};

run().catch(handleError);
