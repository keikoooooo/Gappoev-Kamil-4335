namespace UnitTest
{
    [TestClass]
    public class UnitTestLearn
    {
        [TestMethod]
        public void TestMethodAuthorization()
        {
            using (var cotext = new AppDbContext())
            var City = new City
            {
                CityName = "Kazan",
                Population = 1234
            };
            context.Cities.Add(city);
            context.SaveChanges();

            using (var cotext = new AppDbContext())
            {
                var cities = cotext.Cities.ToList();
                Assert.Single(cities);
                Assert.Equal("Kazan", cities.First().Name_);
                Assert.Equal(1234, cities.First().Population);
            }

        }
    }
}