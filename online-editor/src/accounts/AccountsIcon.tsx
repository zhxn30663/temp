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

import React, { useCallback } from "react";
import { Button, ButtonVariant } from "@patternfly/react-core/dist/js/components/Button";
import { Divider } from "@patternfly/react-core/dist/js/components/Divider";
import { Modal, ModalVariant } from "@patternfly/react-core/dist/js/components/Modal";
import { Page, PageSection } from "@patternfly/react-core/dist/js/components/Page";
import { Text, TextContent, TextVariants } from "@patternfly/react-core/dist/js/components/Text";
import { Flex, FlexItem } from "@patternfly/react-core/dist/js/layouts/Flex";
import AngleLeftIcon from "@patternfly/react-icons/dist/js/icons/angle-left-icon";
import UserIcon from "@patternfly/react-icons/dist/js/icons/user-icon";
import { ConnectToGitSection } from "./git/ConnectToGitSection";
import { AuthProvidersGallery } from "../authProviders/AuthProvidersGallery";
import { AuthProviderIcon } from "../authProviders/AuthProviderIcon";
import { AuthSessionsList } from "../authSessions/AuthSessionsList";
import { useAuthSessions } from "../authSessions/AuthSessionsContext";
import PlusIcon from "@patternfly/react-icons/dist/js/icons/plus-icon";
import { EmptyState, EmptyStateBody, EmptyStateIcon } from "@patternfly/react-core/dist/js/components/EmptyState";
import { Title } from "@patternfly/react-core/dist/js/components/Title";
import UsersIcon from "@patternfly/react-icons/dist/js/icons/users-icon";
import { AccountsDispatchActionKind, AccountsSection, useAccounts, useAccountsDispatch } from "./AccountsContext";
import { ConnectToOpenShiftSection } from "./openshift/ConnectToOpenShiftSection";
import { Bullseye } from "@patternfly/react-core/dist/js/layouts/Bullseye";
import { ConnectToKubernetesSection } from "./kubernetes/ConnectToKubernetesSection";

export function AccountsIcon() {
  const accounts = useAccounts();
  const accountsDispatch = useAccountsDispatch();
  const { authSessions } = useAuthSessions();

  const goBack = useCallback(() => {
    if (accounts.section !== AccountsSection.HOME && accounts.section !== AccountsSection.CLOSED) {
      accountsDispatch({ kind: accounts.backActionKind });
    }
  }, [accountsDispatch, accounts]);

  return (
    <>
      <Button
        variant={ButtonVariant.plain}
        onClick={() => accountsDispatch({ kind: AccountsDispatchActionKind.GO_HOME })}
        className={"kie-tools--masthead-hoverable-dark"}
      >
        <UserIcon />
      </Button>
      {accounts.section !== AccountsSection.CLOSED && (
        <Modal
          aria-label={"账户"}
          variant={ModalVariant.large}
          isOpen={true}
          onClose={() => accountsDispatch({ kind: AccountsDispatchActionKind.CLOSE })}
          header={
            <div>
              {accounts.section !== AccountsSection.HOME && !accounts.onNewAuthSession && (
                <>
                  <Button
                    key={"back"}
                    onClick={goBack}
                    variant={ButtonVariant.link}
                    style={{ paddingLeft: 0 }}
                    icon={<AngleLeftIcon />}
                  >
                    {`返回`}
                  </Button>
                  <br />
                  <br />
                </>
              )}
              {accounts.section === AccountsSection.HOME && (
                <>
                  <>
                    <Flex justifyContent={{ default: "justifyContentFlexStart" }}>
                      <TextContent>
                        <Text component={TextVariants.h1}>已连接的账户</Text>
                      </TextContent>
                      {authSessions.size > 0 && (
                        <Button
                          icon={<PlusIcon />}
                          variant={ButtonVariant.link}
                          onClick={() => accountsDispatch({ kind: AccountsDispatchActionKind.SELECT_AUTH_PROVIDER })}
                        >
                          Add
                        </Button>
                      )}
                    </Flex>
                  </>
                </>
              )}
              {accounts.section === AccountsSection.CONNECT_TO_AN_ACCOUNT && (
                <>
                  <TextContent>
                    <Text component={TextVariants.h1}>Select a provider</Text>
                  </TextContent>
                </>
              )}
              {accounts.section === AccountsSection.CONNECT_TO_GITHUB && (
                <>
                  <Flex justifyContent={{ default: "justifyContentSpaceBetween" }}>
                    <FlexItem>
                      <Flex
                        justifyContent={{ default: "justifyContentFlexStart" }}
                        spaceItems={{ default: "spaceItemsSm" }}
                      >
                        <TextContent>
                          <Text component={TextVariants.h2}>
                            {`连接到`}
                            &nbsp;
                            {accounts.selectedAuthProvider.name}
                          </Text>
                        </TextContent>
                        <TextContent>
                          <Text component={TextVariants.small}>
                            <i>{accounts.selectedAuthProvider.domain}</i>
                          </Text>
                        </TextContent>
                      </Flex>
                    </FlexItem>
                    <AuthProviderIcon authProvider={accounts.selectedAuthProvider} size={"sm"} />
                  </Flex>
                </>
              )}
              {accounts.section === AccountsSection.CONNECT_TO_BITBUCKET && (
                <>
                  <Flex justifyContent={{ default: "justifyContentSpaceBetween" }}>
                    <FlexItem>
                      <Flex
                        justifyContent={{ default: "justifyContentFlexStart" }}
                        spaceItems={{ default: "spaceItemsSm" }}
                      >
                        <TextContent>
                          <Text component={TextVariants.h2}>
                            {`连接到`}
                            &nbsp;
                            {accounts.selectedAuthProvider.name}
                          </Text>
                        </TextContent>
                        <TextContent>
                          <Text component={TextVariants.small}>
                            <i>{accounts.selectedAuthProvider.domain}</i>
                          </Text>
                        </TextContent>
                      </Flex>
                    </FlexItem>
                    <AuthProviderIcon authProvider={accounts.selectedAuthProvider} size={"sm"} />
                  </Flex>
                </>
              )}
              {accounts.section === AccountsSection.CONNECT_TO_OPENSHIFT && (
                <>
                  <TextContent>
                    <Text component={TextVariants.h1}>连接到OpenShift</Text>
                  </TextContent>
                </>
              )}
              {accounts.section === AccountsSection.CONNECT_TO_KUBERNETES && (
                <>
                  <TextContent>
                    <Text component={TextVariants.h1}>连接到Kubernetes</Text>
                  </TextContent>
                </>
              )}
              <br />
              <Divider inset={{ default: "insetMd" }} />
            </div>
          }
        >
          <Page>
            <PageSection variant={"light"}>
              <>
                {accounts.section === AccountsSection.HOME && (
                  <>
                    {authSessions.size <= 0 && (
                      <Bullseye>
                        <EmptyState style={{ maxWidth: "400px" }}>
                          <EmptyStateIcon icon={UsersIcon} />
                          <Title headingLevel="h4" size="md">
                            {`Looks like you don't have any accounts connected yet`}
                          </Title>
                          <br />
                          <br />

                          <EmptyStateBody>{`连接到外部账户可启用Git和云集成。`}</EmptyStateBody>
                          <EmptyStateBody>
                            <small>{`已连接账户的凭据在本地浏览器中存储，不会与任何人共享。`}</small>
                          </EmptyStateBody>
                          <Button
                            variant="primary"
                            onClick={() => accountsDispatch({ kind: AccountsDispatchActionKind.SELECT_AUTH_PROVIDER })}
                          >
                            连接账户
                          </Button>
                        </EmptyState>
                      </Bullseye>
                    )}
                    {authSessions.size > 0 && (
                      <>
                        <AuthSessionsList />
                      </>
                    )}
                  </>
                )}
                {accounts.section === AccountsSection.CONNECT_TO_AN_ACCOUNT && (
                  <AuthProvidersGallery
                    backActionKind={AccountsDispatchActionKind.SELECT_AUTH_PROVIDER}
                    authProviderGroup={accounts.authProviderGroup}
                  />
                )}
                {accounts.section === AccountsSection.CONNECT_TO_GITHUB && (
                  <ConnectToGitSection authProvider={accounts.selectedAuthProvider} />
                )}
                {accounts.section === AccountsSection.CONNECT_TO_BITBUCKET && (
                  <ConnectToGitSection authProvider={accounts.selectedAuthProvider} />
                )}
                {accounts.section === AccountsSection.CONNECT_TO_OPENSHIFT && <ConnectToOpenShiftSection />}
                {accounts.section === AccountsSection.CONNECT_TO_KUBERNETES && <ConnectToKubernetesSection />}
              </>
            </PageSection>
          </Page>
        </Modal>
      )}
    </>
  );
}
