export type user = {
    name: String,
    repositories: repositroy[] | null,
    languages: codingLang[] | null,
}


export type repositroy = {
    name: String,
    description: String | null,
    created_at: String,
    updated_at: String,
    pushed_at: String,
    URL: String,
    langs: projectLang[] | null
}

type projectLang = {
    name: String,
    lines: Number
}



type codingLang = {
    name: String,
    lines: Number,
    repos: repositroy[],
}

export type GitHubRepo = {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    html_url: string;
    type: string;
    site_admin: boolean;
  };
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;

  created_at: string;
  updated_at: string;
  pushed_at: string;

  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;

  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;

  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions?: boolean;

  forks_count: number;
  mirror_url: string | null;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  is_template?: boolean;
  visibility?: string; // e.g., "public"
  default_branch: string;

  topics?: string[];
  permissions?: {
    admin: boolean;
    push: boolean;
    pull: boolean;
  };

  // Optional block shown if authenticated and has access
  security_and_analysis?: {
    advanced_security?: { status: string };
    secret_scanning?: { status: string };
    secret_scanning_push_protection?: { status: string };
    secret_scanning_non_provider_patterns?: { status: string };
  };
}
