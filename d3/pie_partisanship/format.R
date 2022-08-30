dat = read.csv("/Users/Chris/website_fall22/site/d3/box/feelings.csv")
dat = cbind(pid_7 = dat[,2], dat[,3:8] * 10)
write.csv(dat, file = "/Users/Chris/website_fall22/site/d3/box/feelings_10.csv")

