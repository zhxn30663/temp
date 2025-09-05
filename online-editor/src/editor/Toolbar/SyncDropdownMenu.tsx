/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from "react";
import { ActiveWorkspace } from "@kie-tools-core/workspaces-git-fs/dist/model/ActiveWorkspace";
import {
  WorkspaceKind,
  WorkspaceKindGistLike,
  isGistLikeWorkspaceKind,
} from "@kie-tools-core/workspaces-git-fs/dist/worker/api/WorkspaceOrigin";
import {
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownPosition,
  DropdownToggle,
} from "@patternfly/react-core/dist/js/components/Dropdown";
import { Tooltip } from "@patternfly/react-core/dist/js/components/Tooltip";
import { switchExpression } from "@kie-tools-core/switch-expression-ts";
import { useOnlineI18n } from "../../i18n";
import BitbucketIcon from "@patternfly/react-icons/dist/js/icons/bitbucket-icon";
import GithubIcon from "@patternfly/react-icons/dist/js/icons/github-icon";
import { Divider } from "@patternfly/react-core/dist/js/components/Divider";
import { Alert } from "@patternfly/react-core/dist/js/components/Alert";
import { Button, ButtonVariant } from "@patternfly/react-core/dist/js/components/Button";
import { AuthSessionSelect } from "../../authSessions/AuthSessionSelect";
import { AuthProviderGroup, GitAuthProviderType } from "../../authProviders/AuthProvidersApi";
import { AccountsDispatchActionKind, useAccountsDispatch } from "../../accounts/AccountsContext";
import SyncAltIcon from "@patternfly/react-icons/dist/js/icons/sync-alt-icon";
import { GIT_ORIGIN_REMOTE_NAME } from "@kie-tools-core/workspaces-git-fs/dist/constants/GitConstants";
import ArrowCircleUpIcon from "@patternfly/react-icons/dist/js/icons/arrow-circle-up-icon";
import { useEditorToolbarContext, useEditorToolbarDispatchContext } from "./EditorToolbarContextProvider";
import { useGitIntegration } from "./GitIntegration/GitIntegrationContextProvider";
import { useAuthProvider } from "../../authProviders/AuthProvidersContext";
import { useAuthSession } from "../../authSessions/AuthSessionsContext";

type Props = {
  workspace: ActiveWorkspace;
};

export function SyncDropdownMenu(props: Props) {
  const { i18n } = useOnlineI18n();
  const accountsDispatch = useAccountsDispatch();
  const { authSession } = useAuthSession(props.workspace.descriptor.gitAuthSessionId);
  const authProvider = useAuthProvider(authSession);
  const { isSyncGistOrSnippetDropdownOpen, isSyncGitRepositoryDropdownOpen } = useEditorToolbarContext();

  const { setSyncGistOrSnippetDropdownOpen, setSyncGitRepositoryDropdownOpen } = useEditorToolbarDispatchContext();

  const {
    auth: { changeGitAuthSessionId, authSessionSelectFilter },
    git: { canPushToGitRepository, pushToGitRepository, pullFromGitRepository },
    gistOrSnippet: { canUpdateGistOrSnippet, updateGistOrSnippet, canForkGitHubGist, forkGitHubGist },
  } = useGitIntegration();

  return (
    <>
      {isGistLikeWorkspaceKind(props.workspace.descriptor.origin.kind) && (
        <Dropdown
          onSelect={() => setSyncGistOrSnippetDropdownOpen(false)}
          isOpen={isSyncGistOrSnippetDropdownOpen}
          position={DropdownPosition.right}
          toggle={
            <DropdownToggle
              id={"sync-dropdown"}
              data-testid={"sync-dropdown"}
              onToggle={(isOpen) => setSyncGistOrSnippetDropdownOpen(isOpen)}
            >
              同步
            </DropdownToggle>
          }
          dropdownItems={[
            <DropdownGroup key={"sync-gist-or-snippet-dropdown-group"}>
              <Tooltip
                data-testid={"gist-or-snippet-it-tooltip"}
                content={
                  <div>
                    {switchExpression(props.workspace.descriptor.origin.kind as WorkspaceKindGistLike, {
                      GITHUB_GIST: i18n.editorToolbar.cantUpdateGistTooltip,
                      BITBUCKET_SNIPPET: i18n.editorToolbar.cantUpdateSnippetTooltip,
                    })}
                  </div>
                }
                trigger={!canUpdateGistOrSnippet ? "mouseenter click" : ""}
                position="left"
              >
                <>
                  <DropdownItem
                    style={{ minWidth: "300px" }}
                    icon={switchExpression(props.workspace.descriptor.origin.kind as WorkspaceKindGistLike, {
                      BITBUCKET_SNIPPET: <BitbucketIcon />,
                      GITHUB_GIST: <GithubIcon />,
                    })}
                    onClick={updateGistOrSnippet}
                    isDisabled={!canUpdateGistOrSnippet}
                  >
                    更新{" "}
                    {switchExpression(props.workspace.descriptor.origin.kind as WorkspaceKindGistLike, {
                      BITBUCKET_SNIPPET: "Bitbucket 代码片段",
                      GITHUB_GIST: "GitHub Gist",
                    })}
                  </DropdownItem>
                  {canForkGitHubGist && (
                    <>
                      <Divider />
                      <li role="menuitem">
                        <Alert
                          isInline={true}
                          variant={"default"}
                          title={<span style={{ whiteSpace: "nowrap" }}>{"您无法更新不属于您的 Gist"}</span>}
                        >
                          <br />
                          {`您可以创建 '${props.workspace.descriptor.name}' 的分支来保存您的更新。`}
                          <br />
                          <br />
                          <Button
                            onClick={forkGitHubGist}
                            variant={ButtonVariant.link}
                            isSmall={true}
                            style={{ paddingLeft: 0 }}
                          >
                            {`分支 Gist`}
                          </Button>
                          <br />
                          <br />
                          {`或者您可以更改 '${props.workspace.descriptor.name}' 的认证来源以便能够更新 Gist。`}
                          <br />
                          <br />
                          <AuthSessionSelect
                            title={`为 '${props.workspace.descriptor.name}' 选择Git认证...`}
                            isPlain={false}
                            authSessionId={props.workspace.descriptor.gitAuthSessionId}
                            showOnlyThisAuthProviderGroupWhenConnectingToNewAccount={AuthProviderGroup.GIT}
                            setAuthSessionId={(newAuthSessionId) => {
                              changeGitAuthSessionId(newAuthSessionId, props.workspace.descriptor.gitAuthSessionId);
                              accountsDispatch({ kind: AccountsDispatchActionKind.CLOSE });
                              setTimeout(() => {
                                setSyncGistOrSnippetDropdownOpen(true);
                              }, 0);
                            }}
                            filter={authSessionSelectFilter}
                          />
                        </Alert>
                      </li>
                    </>
                  )}
                  {!canPushToGitRepository && (
                    <>
                      <Divider />
                      <Alert
                        isInline={true}
                        variant={"default"}
                        title={`无法更新 ${switchExpression(authProvider?.type as GitAuthProviderType, {
                          github: "GitHub 仓库",
                          bitbucket: "Bitbucket 仓库",
                          default: "Git 仓库",
                        })}，需要选择匹配的认证来源`}
                        actionLinks={
                          <AuthSessionSelect
                            title={`为 '${props.workspace.descriptor.name}' 选择Git认证...`}
                            isPlain={false}
                            authSessionId={props.workspace.descriptor.gitAuthSessionId}
                            showOnlyThisAuthProviderGroupWhenConnectingToNewAccount={AuthProviderGroup.GIT}
                            setAuthSessionId={(newAuthSessionId) => {
                              changeGitAuthSessionId(newAuthSessionId, props.workspace.descriptor.gitAuthSessionId);
                              accountsDispatch({ kind: AccountsDispatchActionKind.CLOSE });
                              setTimeout(() => {
                                setSyncGistOrSnippetDropdownOpen(true);
                              }, 0);
                            }}
                            filter={authSessionSelectFilter}
                          />
                        }
                      >
                        {`为 '${
                          props.workspace.descriptor.name
                        }' 选择认证来源以便能够更新 ${switchExpression(
                          props.workspace.descriptor.origin.kind as WorkspaceKindGistLike,
                          {
                            GITHUB_GIST: "GitHub Gist",
                            BITBUCKET_SNIPPET: "Bitbucket 代码片段",
                          }
                        )}.`}
                      </Alert>
                    </>
                  )}
                </>
              </Tooltip>
            </DropdownGroup>,
          ]}
        />
      )}
      {props.workspace.descriptor.origin.kind === WorkspaceKind.GIT && (
        <Dropdown
          onSelect={() => setSyncGitRepositoryDropdownOpen(false)}
          isOpen={isSyncGitRepositoryDropdownOpen}
          position={DropdownPosition.right}
          toggle={
            <DropdownToggle
              id={"sync-dropdown"}
              data-testid={"sync-dropdown"}
              onToggle={(isOpen) => setSyncGitRepositoryDropdownOpen(isOpen)}
            >
              同步
            </DropdownToggle>
          }
          dropdownItems={[
            <DropdownGroup key={"sync-git-dropdown-group"}>
              <DropdownItem
                icon={<SyncAltIcon />}
                onClick={() => pullFromGitRepository({ showAlerts: true })}
                description={`获取上游 '${GIT_ORIGIN_REMOTE_NAME}/${props.workspace.descriptor.origin.branch}' 的最新更改。`}
              >
                拉取
              </DropdownItem>
              <Tooltip
                data-testid={"git-it-tooltip"}
                content={<div>{`您需要选择认证来源才能推送到此仓库。`}</div>}
                trigger={!canPushToGitRepository ? "mouseenter click" : ""}
                position="left"
              >
                <>
                  <DropdownItem
                    icon={<ArrowCircleUpIcon />}
                    onClick={pushToGitRepository}
                    isDisabled={!canPushToGitRepository}
                    description={`将您的更改推送到上游 '${GIT_ORIGIN_REMOTE_NAME}/${props.workspace.descriptor.origin.branch}'。`}
                  >
                    推送
                  </DropdownItem>
                  {!canPushToGitRepository && (
                    <>
                      <Alert
                        isInline={true}
                        variant={"default"}
                        title={"无法推送，需要选择认证来源"}
                        actionLinks={
                          <AuthSessionSelect
                            title={`为 '${props.workspace.descriptor.name}' 选择Git认证...`}
                            isPlain={false}
                            authSessionId={props.workspace.descriptor.gitAuthSessionId}
                            showOnlyThisAuthProviderGroupWhenConnectingToNewAccount={AuthProviderGroup.GIT}
                            setAuthSessionId={(newAuthSessionId) => {
                              changeGitAuthSessionId(newAuthSessionId, props.workspace.descriptor.gitAuthSessionId);
                              accountsDispatch({ kind: AccountsDispatchActionKind.CLOSE });
                              setTimeout(() => {
                                setSyncGitRepositoryDropdownOpen(true);
                              });
                            }}
                            filter={authSessionSelectFilter}
                          />
                        }
                      >
                        {`为 '${props.workspace.descriptor.name}' 选择认证来源以便能够推送。`}
                      </Alert>
                    </>
                  )}
                </>
              </Tooltip>
            </DropdownGroup>,
          ]}
        />
      )}
    </>
  );
}
