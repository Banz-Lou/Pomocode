const assignedIssues = user => `query {
  search(query:"assignee:${user} is:issue state:open",type:ISSUE,last:100) {
    issueCount
    nodes {
      ... on Issue {
        id
        number
        title
        body
        repository {
          id
          nameWithOwner
          url
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`;

module.exports.assignedIssues = assignedIssues;
