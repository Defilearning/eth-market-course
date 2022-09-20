import { CourseCard, CourseList } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";
import { Fragment, useState } from "react";
import { useOwnedCourses, useWalletInfo } from "@components/hooks/web3";
import { Button, Loader, Message } from "@components/ui/common";
import { OrderModal } from "@components/ui/order";
import { MarketHeader } from "@components/ui/marketplace";
import { useWeb3 } from "@components/providers";
import { withToast } from "@utils/toast";

export default function Marketplace({ courses }) {
  const { web3, contract, requireInstall } = useWeb3();
  const { hasConnectedWallet, account, isConnecting } = useWalletInfo();
  const { ownedCourses } = useOwnedCourses(courses, account.data);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [busyCourse, setBusyCourse] = useState(null);
  const [isNewPurchase, setIsNewPurchase] = useState(true);

  const purchaseCourse = async (order, course) => {
    const hexCourseId = web3.utils.utf8ToHex(course.id);

    const orderHash = web3.utils.soliditySha3(
      {
        type: "bytes16",
        value: hexCourseId,
      },
      {
        type: "address",
        value: account.data,
      }
    );

    const value = web3.utils.toWei(String(order.price));

    setBusyCourse(course.id);
    if (isNewPurchase) {
      const emailHash = web3.utils.sha3(order.email);

      const proof = web3.utils.soliditySha3(
        {
          type: "bytes32",
          value: emailHash,
        },
        {
          type: "bytes32",
          value: orderHash,
        }
      );
      withToast(_purchaseCourse({ hexCourseId, proof, value }, course));
    } else {
      withToast(_repurchaseCourse({ courseHash: orderHash, value }, course));
    }
  };

  const _purchaseCourse = async ({ hexCourseId, proof, value }, course) => {
    try {
      const result = await contract.methods
        .purchaseCourse(hexCourseId, proof)
        .send({ from: account.data, value });

      ownedCourses.mutate([
        ...ownedCourses.data,
        {
          ...course,
          proof,
          state: "purchased",
          owner: account.data,
          price: value,
        },
      ]);
      return result;
    } catch (e) {
      throw new Error(e.message);
    } finally {
      setBusyCourse(null);
    }
  };

  const _repurchaseCourse = async ({ courseHash, value }, course) => {
    try {
      const result = await contract.methods
        .repurchaseCourse(courseHash)
        .send({ from: account.data, value });

      const index = ownedCourses.data.findIndex((c) => c.id === course.id);

      if (index >= 0) {
        ownedCourses.data[index].state = "purchased";
        ownedCourses.mutate(ownedCourses.data);
      } else {
        ownedCourses.mutate();
      }

      return result;
    } catch (e) {
      throw new Error(e.message);
    } finally {
      setBusyCourse(null);
    }
  };

  const cleanupModal = () => {
    setSelectedCourse(null);
    setIsNewPurchase(true);
  };

  return (
    <Fragment>
      <MarketHeader />
      <CourseList courses={courses}>
        {(course) => {
          const owned = ownedCourses.lookup[course.id];
          return (
            <CourseCard
              disabled={!hasConnectedWallet}
              key={course.id}
              course={course}
              state={owned?.state}
              Footer={() => {
                if (requireInstall) {
                  return (
                    <Button size="sm" variant="lightPurple" disabled={true}>
                      Install
                    </Button>
                  );
                }

                if (isConnecting) {
                  return (
                    <Button size="sm" variant="lightPurple" disabled={true}>
                      <Loader size="sm" />
                    </Button>
                  );
                }

                if (!ownedCourses.hasInitialResponse) {
                  return (
                    <Button variant="white" disabled={true} size="sm">
                      {hasConnectedWallet ? "Loading State..." : "Connect"}
                    </Button>
                    // <div style={{ height: "42px" }}></div>
                  );
                }

                const isBusy = busyCourse === course.id;

                if (owned) {
                  return (
                    <>
                      <div className="flex">
                        <Button
                          size="sm"
                          variant="white"
                          disabled={false}
                          onClick={() =>
                            alert("You are the owner of this course")
                          }
                        >
                          Yours &#10004;
                        </Button>
                        {owned.state === "deactivated" && (
                          <div className="ml-1">
                            <Button
                              size="sm"
                              variant="purple"
                              disabled={isBusy}
                              onClick={() => {
                                setIsNewPurchase(false);
                                setSelectedCourse(course);
                              }}
                            >
                              {isBusy ? (
                                <div className="flex">
                                  <Loader size="sm" />
                                  <div className="ml-2">In Progress</div>
                                </div>
                              ) : (
                                <div>Fund to Activate</div>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  );
                }

                return (
                  <Button
                    size="sm"
                    variant="lightPurple"
                    disabled={!hasConnectedWallet || isBusy}
                    onClick={() => {
                      setSelectedCourse(course);
                    }}
                  >
                    {isBusy ? (
                      <div className="flex">
                        <Loader size="sm" />
                        <div className="ml-2">In Progress</div>
                      </div>
                    ) : (
                      <div>Purchase</div>
                    )}
                  </Button>
                );
              }}
            />
          );
        }}
      </CourseList>

      {selectedCourse && (
        <OrderModal
          course={selectedCourse}
          isNewPurchase={isNewPurchase}
          onSubmit={(formData, course) => {
            purchaseCourse(formData, course);
            cleanupModal();
          }}
          onClose={cleanupModal}
        />
      )}
    </Fragment>
  );
}

export function getStaticProps() {
  const { data } = getAllCourses();

  return {
    props: {
      courses: data,
    },
  };
}

Marketplace.Layout = BaseLayout;
